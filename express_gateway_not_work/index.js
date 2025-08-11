// Stupid javascript will not work, it stucks forever
//
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

const modifyResponse = (proxyRes, req, res) => {
    let body = [];
    // 监听代理响应的数据块
    proxyRes.on('data', (chunk) => {
        body.push(chunk);
    });
    // 当代理响应结束时
    proxyRes.on('end', () => {
        try {
            // 获取原始响应头和状态码
            const originalHeaders = proxyRes.headers;
            const statusCode = proxyRes.statusCode;

            // 将所有数据块合并并转换为字符串 (假设是HTML)
            const html = Buffer.concat(body).toString();
            // 修改HTML内容
            const modifiedHtml = html.replace(
                '</head>',
                '<meta name="author" content="yingshaoxo"></head>'
            );

            // 复制原始响应头，并删除 Content-Length，因为我们修改了内容，长度会变化
            // Node.js 会自动计算新的 Content-Length，或者使用 Transfer-Encoding: chunked
            const headersToSend = { ...originalHeaders };
            delete headersToSend['content-length']; // 移除旧的 Content-Length
            // 某些情况下，也可能需要移除 transfer-encoding，如果它与 Content-Length 冲突
            delete headersToSend['transfer-encoding']; 
            
            // 设置响应的状态码和修改后的头部
            // res.writeHead() 用于在发送响应体之前，显式设置状态码和头部
            res.writeHead(statusCode, headersToSend);
            // 发送修改后的HTML内容并结束响应
            res.end(modifiedHtml);

        } catch (err) {
            console.error('Response modification error:', err);
            // 如果在处理过程中发生错误，确保响应被结束
            if (!res.headersSent) { // 只有在头部未发送时才设置状态码
                res.status(500);
            }
            // 发送错误信息并结束响应
            res.end('Error processing response: ' + err.message);
        }
        // !!! 关键修复 !!!
        // 移除了这里多余的 `res.send('error');`
        // 确保 `res.end()` 或 `res.send()` 只被调用一次
    });
};

// 定义一个特定的路由处理，例如 /hi
app.get('/hi', (req, res) => {
    res.json({ message: 'Hello from Express route!' });
});

// 配置代理中间件
const proxy = createProxyMiddleware({
    target: 'http://127.0.0.1:8000', // Python HTTP服务器地址
    changeOrigin: true, // 更改请求头的 Origin 为目标URL
    selfHandleResponse: true, // 关键：允许我们手动处理代理响应，以便修改它
    onProxyRes: modifyResponse, // 指定处理代理响应的函数
    
    // 添加超时配置，防止代理连接无限期挂起
    proxyTimeout: 5000, // 从代理服务器到目标服务器的连接超时时间 (5秒)
    timeout: 5000 // 从目标服务器接收响应的超时时间 (5秒)
});

// 使用 app.use('/') 将代理中间件应用于所有传入请求
// 注意：app.get('/hi') 必须在 app.use('/', proxy) 之前定义，
// 以确保 /hi 路由首先被 Express 自己的处理器捕获。
app.use('/', (req, res, next) => {
    console.log(`Incoming request path: ${req.path}`);

    // 如果请求路径是 /hi，则由 Express 的路由处理
    if (req.path === '/hi') {
        return res.json({ message: 'Hello from Express route!' });
    }

    // 对于所有其他请求，将其代理到目标服务器
    // `return proxy(...)` 确保在代理处理请求后，Express 不会继续执行其他中间件
    proxy(req, res, next);
});


// 启动 Express 服务器
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
});
