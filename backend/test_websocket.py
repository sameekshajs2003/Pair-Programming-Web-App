"""
WebSocket test script to verify real-time collaboration
Run this in multiple terminal windows to simulate multiple users
"""
import asyncio
import websockets
import json
import sys

async def test_websocket_client(room_id: str, user_id: str):
    """Test WebSocket connection and messaging"""
    uri = f"ws://localhost:8000/ws/{room_id}"
    
    print(f"\n{'='*60}")
    print(f"User: {user_id}")
    print(f"Connecting to: {uri}")
    print(f"{'='*60}\n")
    
    try:
        async with websockets.connect(uri) as websocket:
            print("✅ Connected to WebSocket!")
            
            # Receive initial state
            initial_msg = await websocket.recv()
            initial_data = json.loads(initial_msg)
            print(f"\n📥 Initial State:")
            print(json.dumps(initial_data, indent=2))
            
            # Send a code update
            print(f"\n📤 Sending code update from {user_id}...")
            code_update = {
                "type": "code_update",
                "code": f"# Code from {user_id}\nprint('Hello from {user_id}')\n",
                "userId": user_id,
                "cursorPosition": 20
            }
            await websocket.send(json.dumps(code_update))
            print("✅ Code update sent!")
            
            # Listen for messages for 30 seconds
            print("\n👂 Listening for messages (30 seconds)...")
            print("Press Ctrl+C to stop\n")
            
            try:
                while True:
                    message = await asyncio.wait_for(websocket.recv(), timeout=30.0)
                    data = json.loads(message)
                    
                    if data["type"] == "code_update":
                        print(f"\n📥 Code Update from {data.get('userId', 'unknown')}:")
                        print(f"   Code: {data['code'][:50]}...")
                        print(f"   Time: {data.get('timestamp', 'N/A')}")
                    elif data["type"] == "user_joined":
                        print(f"\n👥 User joined! Total connections: {data['connectionCount']}")
                    elif data["type"] == "user_left":
                        print(f"\n👋 User left. Remaining connections: {data['connectionCount']}")
                    else:
                        print(f"\n📥 Message: {data}")
                        
            except asyncio.TimeoutError:
                print("\n⏱️  No more messages. Closing connection.")
                
    except websockets.exceptions.WebSocketException as e:
        print(f"\n❌ WebSocket Error: {e}")
    except Exception as e:
        print(f"\n❌ Error: {e}")

def main():
    """Main function to run WebSocket test"""
    if len(sys.argv) < 2:
        print("Usage: python test_websocket.py <room_id> [user_id]")
        print("\nExample:")
        print("  python test_websocket.py abc123 user1")
        print("\nTo test collaboration, run this in multiple terminals with different user IDs")
        sys.exit(1)
    
    room_id = sys.argv[1]
    user_id = sys.argv[2] if len(sys.argv) > 2 else f"user_{id(asyncio)}"
    
    asyncio.run(test_websocket_client(room_id, user_id))

if __name__ == "__main__":
    main()
