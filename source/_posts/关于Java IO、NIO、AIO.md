------
title: 关于Java IO、NIO、AIO
date: 2018-07-02 08:10:39
tags:
  - Java
  - IO
categories:
  - Java
------
关于Java常用数据结构，后期继续整理

<!--more-->
## 关于 IO
- BIO 同步并阻塞
- NIO 同步非阻塞
- AIO(NIO.2) `JDK7`, 异步非阻塞

## NIO
- Channel `通道` 传输
- Buffer `缓冲区` 存储
- Selectors `多路复用器` 监听 Channel IO 状况

```java
/**
 * Created by hocgin on 2018/7/2.
 * email: hocgin@gmail.com
 * NIO
 * Non-blocking IO（非阻塞IO）
 * - Selectors 多路复用器，用于监控 SelectableChannel IO状况
 * -- SelectableChannel
 * ----SocketChannel
 * ----ServerSocketChannel
 * ----DatagramChannel
 * <p>
 * ----Pipe.SinkChannel 单向管道-写
 * ----Pipe.SourceChannel 单向管道-读
 * <p>
 * - Channels
 * <p>
 * - Buffers
 * -- capacity 总容量
 * -- limit 界限，可操作最大范围
 * -- position 当前操作位置
 * -- mark 标记，记录position
 * <p>
 * 0 <= mark <= position <= limit <= capacity
 */
public class NIOTest {
    
    /**
     * 阻塞模式的 Socket NIO
     */
    @Test
    public void nio_client() {
        String path = "/Users/hocgin/Document/Projects/GitHub/23-Day/src/test/java/in/hocg/Test.java";
        try (
                SocketChannel channel = SocketChannel.open(new InetSocketAddress("127.0.0.1", 9898));
                FileChannel inChannel = FileChannel.open(Paths.get(path), StandardOpenOption.READ);
        ) {
            ByteBuffer buffer = ByteBuffer.allocate(1024);
            while (inChannel.read(buffer) != -1) {
                buffer.flip();
                channel.write(buffer);
                buffer.clear();
            }
            
            channel.shutdownOutput();
            
            /**
             * 接收反馈
             */
            while (channel.read(buffer) != -1) {
                buffer.flip();
                System.out.println(new String(buffer.array(), 0, buffer.limit()));
                buffer.clear();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    
    /**
     * 阻塞模式的 Socket NIO
     */
    @Test
    public void nio_server() {
        try (
                ServerSocketChannel channel = ServerSocketChannel.open();
        ) {
            channel.bind(new InetSocketAddress(9898));
            SocketChannel socketChannel = channel.accept();
            ByteBuffer buffer = ByteBuffer.allocate(1024);
            while (socketChannel.read(buffer) != -1) {
                buffer.flip();
                System.out.println(new String(buffer.array(), 0, buffer.limit()));
                buffer.clear();
            }
            
            buffer.put("接收完毕".getBytes());
            buffer.flip();
            socketChannel.write(buffer);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    
    
    /**
     * 非阻塞模式的 Socket NIO
     */
    @Test
    public void nio_client2() {
        try (
                SocketChannel channel = SocketChannel.open(new InetSocketAddress("127.0.0.1", 9898));
        ) {
            // 非阻塞
            channel.configureBlocking(false);
            ByteBuffer buffer = ByteBuffer.allocate(1024);
            /**
             * 发送信息
             */
            buffer.put(LocalDateTime.now().toString().getBytes());
            buffer.flip();
            channel.write(buffer);
            
            /**
             * 接收反馈
             */
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    
    /**
     * 非阻塞模式的 Socket NIO
     */
    @Test
    public void nio_server2() {
        try (
                ServerSocketChannel channel = ServerSocketChannel.open();
        ) {
            // 非阻塞
            channel.configureBlocking(false);
            
            channel.bind(new InetSocketAddress(9898));
            
            Selector selector = Selector.open();
            /**
             * 注册通道 指定事件类型
             */
            channel.register(selector, SelectionKey.OP_ACCEPT);
            
            while (selector.select() > 0) {
                Iterator<SelectionKey> iterator = selector.selectedKeys().iterator();
                while (iterator.hasNext()) {
                    SelectionKey action = iterator.next();
                    if (action.isAcceptable()) {
                        SocketChannel socketChannel = channel.accept();
                        socketChannel.configureBlocking(false);
                        socketChannel.register(selector, SelectionKey.OP_READ);
                    } else if (action.isReadable()) {
                        SocketChannel socketChannel = (SocketChannel) action.channel();
                        ByteBuffer buffer = ByteBuffer.allocate(1024);
                        try {
                            while (socketChannel.read(buffer) != -1) {
                                buffer.flip();
                                String s = new String(buffer.array(), 0, buffer.limit());
                                if (!Strings.isNullOrEmpty(s)) {
                                    System.out.println(s);
                                }
                                buffer.clear();
                            }
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    }
                    iterator.remove();
                }
            }
            
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    
    @Test
    public void aio_server() throws IOException, InterruptedException {
//        AsynchronousChannelGroup group = AsynchronousChannelGroup.withCachedThreadPool(Executors.newCachedThreadPool(), 10);
        AsynchronousServerSocketChannel channel = AsynchronousServerSocketChannel.open();
        channel.bind(new InetSocketAddress(9898));
        channel.accept(null, new CompletionHandler<AsynchronousSocketChannel, Void>() {
            final ByteBuffer buffer = ByteBuffer.allocate(1024);
            
            @Override
            public void completed(AsynchronousSocketChannel result, Void attachment) {
                
                try {
                    result.read(buffer).get();
                    buffer.flip();
                    System.out.println(String.format("服务端 成功 :%s", new String(buffer.array()).trim()));
                    result.close();
                    channel.accept(null, this);
                } catch (IOException | InterruptedException | ExecutionException e) {
                    e.printStackTrace();
                }
            }
            
            @Override
            public void failed(Throwable exc, Void attachment) {
                System.out.println("failed");
            }
        });
        
        LockSupport.park();
    }
    
    @Test
    public void aio_client() throws IOException {
        AsynchronousSocketChannel channel = AsynchronousSocketChannel.open();
        channel.connect(new InetSocketAddress("127.0.0.1", 9898), null, new CompletionHandler<Void, Void>() {
            @Override
            public void completed(Void result, Void attachment) {
                ByteBuffer buffer = ByteBuffer.allocate(1024);
                buffer.put("你好".getBytes());
                buffer.flip();
                channel.write(buffer);
            }
            
            @Override
            public void failed(Throwable exc, Void attachment) {
                System.out.println(exc);
            }
        });
        
        
    }
    
    
    /**
     * Buffer
     *
     * @throws IOException
     */
    @Test
    public void buffer() throws IOException {
        ByteBuffer buffer = ByteBuffer.allocate(1024);
        System.out.println(buffer.position()); // 0
        System.out.println(buffer.limit());    // 1024
        System.out.println(buffer.capacity());  // 1024
        buffer.put("asd".getBytes());
        
        buffer.flip(); // 设置读取的范围限制至 position
        byte[] dst = new byte[buffer.limit()];
        buffer.get(dst);
        System.out.println(new String(dst, 0, dst.length));
        
        buffer.rewind(); // 重读 position = 0 mark = -1
        
        buffer.clear(); // 清空 position = 0  limit = capacity mark = -1
        
        buffer.mark(); // 标记 mark = position
        
        buffer.reset(); // position恢复为标记位置 position = mark
        
        buffer.hasRemaining(); // 是否有剩余数据 position < limit
        
        buffer.remaining(); // 剩余数量 limit - position
    }
    
    /**
     * getChannel
     * - 本地
     * - FileInputStream/FileOutputStream
     * - RandomAccessFile
     * - 网络
     * - Socket
     * - ServerSocket
     * - DatagramSocket
     * - JDK 7
     * - xxChannel.open()
     * - Files.newByteChannel()
     * - Channels.newXXX
     */
    @Test
    public void channel() throws IOException {
        String path = "/Users/hocgin/Document/Projects/GitHub/23-Day/src/test/java/in/hocg/Test.java";
        FileInputStream in = new FileInputStream(path);
        ReadableByteChannel channel = Channels.newChannel(in);
        ByteBuffer buffer = ByteBuffer.allocate(1024);
        while (channel.read(buffer) != -1) {
            buffer.flip();
            System.out.println(String.format("%s", new String(buffer.array(), 0, buffer.limit())));
            buffer.clear();
        }
        channel.close();
        in.close();
    }
    
    /**
     * 直接缓冲区
     */
    @Test
    public void channel2() {
        String path = "/Users/hocgin/Document/Projects/GitHub/23-Day/src/test/java/in/hocg/Test.java";
        try (
                FileChannel inChannel = FileChannel.open(Paths.get(path), StandardOpenOption.READ);
                FileChannel outChannel = FileChannel.open(Paths.get(path), StandardOpenOption.READ, StandardOpenOption.WRITE, StandardOpenOption.CREATE)
        ) {
            MappedByteBuffer inMap = inChannel.map(FileChannel.MapMode.READ_ONLY, 0, inChannel.size());
            MappedByteBuffer outMap = outChannel.map(FileChannel.MapMode.READ_WRITE, 0, inChannel.size());
            byte[] bytes = new byte[inMap.limit()];
            inMap.get(bytes);
            outMap.put(bytes);
        } catch (IOException e) {
            e.printStackTrace();
        }
        
    }
    
    /**
     * 通道间的数据传输(直接缓冲区)
     */
    @Test
    public void transfer() {
        String path = "/Users/hocgin/Document/Projects/GitHub/23-Day/src/test/java/in/hocg/Test.java";
        try (
                FileChannel inChannel = FileChannel.open(Paths.get(path), StandardOpenOption.READ);
                FileChannel outChannel = FileChannel.open(Paths.get(path), StandardOpenOption.READ, StandardOpenOption.WRITE, StandardOpenOption.CREATE)
        ) {
            inChannel.transferTo(0, inChannel.size(), outChannel);
//            inChannel.transferFrom(outChannel,0, inChannel.size());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    
    /**
     * 分散读取(Scatter)
     * 聚集写入(Gather)
     */
    @Test
    public void scatter() {
        String path = "/Users/hocgin/Document/Projects/GitHub/23-Day/src/test/java/in/hocg/Test.java";
        try (
                RandomAccessFile f = new RandomAccessFile(path, "rw");
        ) {
            FileChannel channel = f.getChannel();
            ByteBuffer allocate1 = ByteBuffer.allocate(1024);
            ByteBuffer allocate2 = ByteBuffer.allocate(1024);
            ByteBuffer[] all = {allocate1, allocate2};
            
            // 分散读取
            channel.read(all);
            
            // 聚集写入
            channel.write(all);
            
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    
    public static void main(String[] args) {
        SortedMap<String, Charset> map = Charset.availableCharsets();
        System.out.println(map);
        System.out.println(Charset.defaultCharset());
        Charset charset = Charset.forName("UTF-8");
        CharsetEncoder charsetEncoder = charset.newEncoder();
        CharsetDecoder charsetDecoder = charset.newDecoder();
    }
    
}
```