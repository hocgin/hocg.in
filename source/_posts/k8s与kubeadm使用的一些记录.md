------
title: K8s 与 kubeadm 使用的一些记录
date: 2019-03-08 09:13
tags:
  - K8s
categories:
  - K8s
------
这篇是了解 k8s 过程随手记录与之相关的一些概念
<!--more-->
## Docker
### 底层技术
- 限制, Cgoups `用来分配资源的, 如cpu,内存` 
- 隔离, Namespace技术 `有点类似命名空间的概念, 隔离进程` 容器本质既特殊进程
  - pid=1
- 文件系统, pivot_root/chroot 构建文件系统
- 文件层, Union File System

## k8s
> 处理容器间的关系, 既编排
- Master
- Node

### 组件和职责
- Master 节点
    - kube-apiserver 负责API服务
    - etcd 持久化数据
    - kubelet 核心
        - 与容器交互(CRI)
        - 管理宿主机(Device Plugin)
        - 网络配置(CNI)
        - 持久化存储(CSI)
    - kube-scheduler 负责调度
    - kube-controller-manager 负责容器编排
- Worker 节点

## kubeadm
### 准备源环境
> OS: Ubuntu 16.04 LTS

- Master 节点
1. 准备源环境
```shell
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
cat <<EOF > /etc/apt/sources.list.d/kubernetes.list
deb http://apt.kubernetes.io/ kubernetes-xenial main
EOF
apt-get update
# E: The method driver /usr/lib/apt/methods/https could not be found.
# sudo apt-get install apt-transport-https

apt-get install -y docker.io kubeadm
```

2. 准备`kubeadm.yml`脚本
```yml
apiVersion: kubeadm.k8s.io/v1alpha1
kind: MasterConfiguration
controllerManagerExtraArgs:
  horizontal-pod-autoscaler-use-rest-clients: "true"
  horizontal-pod-autoscaler-sync-period: "10s"
  node-monitor-grace-period: "10s"
apiServerExtraArgs:
  runtime-config: "api/all=true"
kubernetesVersion: "stable-1.11"
```

3. 执行 kubeadm 初始化
```shell
kubeadm init config kubeadm.yml
```

4. 执行结果
```shell
# ...
Your Kubernetes master has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  https://kubernetes.io/docs/concepts/cluster-administration/addons/

You can now join any number of machines by running the following on each node
as root:

  kubeadm join 10.140.0.2:6443 --token 9tf8vg.633b2jjzzsglp9n6 --discovery-token-ca-cert-hash sha256:7bc87892cf9715e1393da6c9aace18e13bc6eeeec2ed8bbf8f01d3bccc5b0c20
```

5. 需要的集群配置
```shell
  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

6. 部署网络插件
```shell
kubectl apply -f https://git.io/weave-kube-1.6
```

- Cluster 节点
1. 同 [Master 节点 1. 准备源环境]

2. 将 Cluster 加入 Master 管理
> 执行 [Master 节点 4. 执行结果 中的 `kubeadm join ...`]
> :重点: 有一种情况, 当`kubeadm init`生成的`token`过期时, 可使用`kubeadm token create`重新生成

### 基本指令
```shell
# 查看节点状态
kubectl get nodes

# 查看节点对象的详情
kubectl describe node k8s-3

# 查看该节点, kube-system 系统上 pods 状态
kubectl get pods -n kube-system

# 安装插件, 例如: 安装网络插件
kubectl apply -f https://git.io/weave-kube-1.6

# 移除所有 Taint, "-" 匹配 ":xx"
# 注意: 单机 Master 需要使用
kubectl taint nodes --all node-role.kubernetes.io/master-
```

### 插件
```shell
# Dashboard, 仪表盘, 项目地址: https://github.com/kubernetes/dashboard
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v1.10.1/src/deploy/recommended/kubernetes-dashboard.yaml

# Rook, 云存储, 项目地址: https://github.com/rook/rook
kubectl apply -f https://raw.githubusercontent.com/rook/rook/master/cluster/examples/kubernetes/ceph/operator.yaml

kubectl apply -f https://raw.githubusercontent.com/rook/rook/master/cluster/examples/kubernetes/ceph/cluster.yaml
```

### 高可用项目
```shell
# RocketMQ
kubectl apply -f https://raw.githubusercontent.com/apache/rocketmq-externals/master/rocketmq-docker/4.4.0/kubernetes/deployment.yaml

```

## 编排文件
```yml
apiVersion: extensions/v1beta1 # 必选，版本号
kind: Deployment # 必选
metadata: # 元数据
  name: rocketmq
# =========== 控制器部分 ===========
spec:
  replicas: 1 # Pods 数量
# =========== Pods 部分 ===========
  template:
    metadata:
     labels:
       app: rocketmq
    spec:
      containers:
      - name: broker
        image: rocketmqinc/rocketmq:4.4.0
        command: ["sh","mqbroker", "-n","localhost:9876"]
        imagePullPolicy: IfNotPresent
        ports:
          - containerPort: 10909 # 容器端口
        #   - hostPort: 10909 # 主机端口
          - containerPort: 10911
        volumeMounts:
          - mountPath: /root/logs
            name: brokeroptlogs
          - mountPath: /root/store
            name: brokeroptstore
      - name: namesrv
        image: rocketmqinc/rocketmq:4.4.0
        command: ["sh","mqnamesrv"]
        imagePullPolicy: IfNotPresent
        ports:
          - containerPort: 9876
        volumeMounts:
          - mountPath: /root/logs
            name: namesrvoptlogs
          - mountPath: /root/store
            name: namesrvoptstore
      volumes:
      - name: brokeroptlogs
        hostPath:
          path: /data/broker/logs
      - name: brokeroptstore
        hostPath:
          path: /data/broker/store
      - name: namesrvoptlogs
        hostPath:
          path: /data/namesrv/logs
      - name: namesrvoptstore
        hostPath:
          path: /data/namesrv/store
```

### 知识点: service·pods·node·cluster·container
- Service: 一组 pods.

### 知识点: nodePort·port·targetPort·containerPort
#### service相关
1. Service 的类型为 ClusterIP
- port: 暴露在 Service(Cluster IP) 上的端口, 即集群中使用.
> service 暴露在 cluster ip 上的端口，<cluster ip>:port 是提供给集群内部客户访问 service 的入口

- targetPort: 指定 pod 上的端口, 会被映射到 port 上.
> targetPort 是 pod 上的端口，从 port 和 nodePort 上到来的数据最终经过 kube-proxy 流入到后端 pod 的 targetPort 上进入容器

2. Service 的类型为 NodePort
- nodePort: 用于集群外部访问
> Cluster IP 只能集群内部访问(源与目标需要满足两个条件: kube-proxy正常运行，跨主机容器网络通信正常)，NodePort 会在每个 kubelet 节点的宿主机开启一个端口，用于应用集群外部访问。

#### 容器相关`类似docker -p`
- containerPort: 容器需要暴露的端口
- hostPort: 容器暴露的端口映射到的主机端口，默认与Container相同

-------------
### 随笔
- 紧密交互关系, Pod 共享一组 Network Namespace, 一组数据卷
- Service 分配 Pod 固定的虚拟IP
- Pod 洁癖机制, Taint/Toleration
- kubeadm 方案, 一键部署, 可通过配置实现生产环境使用(未到GA阶段)
- minikuke 方案, 一键部署, 仅能用于本地实验
- kops 方案, 可用于部署生产环境