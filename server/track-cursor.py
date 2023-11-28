import asyncio
import websockets

# Store the connected clients and their cursor positions
clients = []

async def cursor_position(websocket, path):
    # Add the client to the clients list when they connect
    clients.append(websocket)
    
    try:
        async for message in websocket:
            # Update the cursor position
            # Send the cursor position to all connected clients (except the sender)
            for client in clients:
                if client != websocket:
                    await client.send(message)
    except websockets.exceptions.ConnectionClosed:
        pass
    finally:
        # Remove the client when they disconnect
        print("Client disconnected")
        clients.remove(websocket)

if __name__ == "__main__":
    # Define the server and port to listen on
    print("Websocket server running on port 8765")
    start_server = websockets.serve(cursor_position, "localhost", 8765)
    
    # Start the server
    asyncio.get_event_loop().run_until_complete(start_server)

    # Keep the server running until it is stopped manually (Ctrl+C)
    asyncio.get_event_loop().run_forever()
