export default function(url, token, handler){
    try {
        const ws = new WebSocket(`${url}?sid=${token}`)

        ws.onopen = handler.onOpen
        ws.onmessage = handler.onMessage
        ws.onerror = handler.onError 
        ws.onclose = handler.onClose
    
        return ws
    } catch(err){
        return new Error("Failed to connect to websocket server : " + err.message)
    }
}