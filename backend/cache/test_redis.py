from redis_client import redis_client

redis_client.set("step4_test", "working")
print(redis_client.get("step4_test"))
