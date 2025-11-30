"""
Simple test script to verify the API functionality
Run this after starting the server to test basic functionality
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_health_check():
    """Test health check endpoint"""
    print("\n=== Testing Health Check ===")
    response = requests.get(f"{BASE_URL}/")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    return response.status_code == 200

def test_create_room():
    """Test room creation"""
    print("\n=== Testing Room Creation ===")
    response = requests.post(f"{BASE_URL}/api/rooms")
    print(f"Status Code: {response.status_code}")
    data = response.json()
    print(f"Response: {data}")
    
    if response.status_code == 201:
        return data["roomId"]
    return None

def test_get_room(room_id):
    """Test getting room information"""
    print(f"\n=== Testing Get Room: {room_id} ===")
    response = requests.get(f"{BASE_URL}/api/rooms/{room_id}")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    return response.status_code == 200

def test_autocomplete():
    """Test autocomplete endpoint"""
    print("\n=== Testing Autocomplete ===")
    
    test_cases = [
        {
            "code": "def ",
            "cursorPosition": 4,
            "language": "python"
        },
        {
            "code": "for ",
            "cursorPosition": 4,
            "language": "python"
        },
        {
            "code": "class MyClass",
            "cursorPosition": 13,
            "language": "python"
        }
    ]
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\nTest Case {i}:")
        print(f"Input: {test_case}")
        
        response = requests.post(
            f"{BASE_URL}/api/autocomplete",
            json=test_case
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        print("-" * 50)

def main():
    """Run all tests"""
    print("=" * 60)
    print("API Test Suite")
    print("=" * 60)
    
    try:
        # Test health check
        if not test_health_check():
            print("\n❌ Health check failed. Is the server running?")
            return
        
        # Test room creation
        room_id = test_create_room()
        if not room_id:
            print("\n❌ Room creation failed")
            return
        
        # Test get room
        if not test_get_room(room_id):
            print("\n❌ Get room failed")
            return
        
        # Test autocomplete
        test_autocomplete()
        
        print("\n" + "=" * 60)
        print("✅ All tests completed successfully!")
        print(f"🎉 Room created: {room_id}")
        print(f"🔗 WebSocket URL: ws://localhost:8000/ws/{room_id}")
        print("=" * 60)
        
    except requests.exceptions.ConnectionError:
        print("\n❌ Error: Cannot connect to server. Make sure it's running on port 8000")
    except Exception as e:
        print(f"\n❌ Error: {e}")

if __name__ == "__main__":
    main()
