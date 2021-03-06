#!/bin/bash

curl -i -X POST http://localhost:8001/upstreams \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'name=navigation&healthchecks.active.http_path=/&healthchecks.active.timeout=5&healthchecks.active.concurrency=10&healthchecks.active.healthy.interval=30&healthchecks.active.unhealthy.interval=30&healthchecks.active.healthy.successes=10&healthchecks.active.unhealthy.tcp_failures=5&healthchecks.active.unhealthy.timeouts=10&healthchecks.active.unhealthy.http_failures=5'

curl -i -X POST http://localhost:8001/upstreams/navigation/targets \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'target=navigation-1:10010&weight=100'

curl -i -X POST http://localhost:8001/upstreams/navigation/targets \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'target=navigation-2:10010&weight=50'

curl -i -X POST http://localhost:8001/services/ \
  -d 'name=navigation' \
  -d 'url=http://navigation/'

curl -X POST http://localhost:8001/services/navigation/routes \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'hosts[]=localhost'

curl -X POST http://localhost:8001/plugins \
  -d "name=rate-limiting"  \
  -d "config.second=5" \
  -d "config.minute=100" \
  -d "config.hour=1000"

curl -i -X POST http://localhost:8001/consumers/ \
  -d "username=web"

curl -i -X POST http://localhost:8001/consumers/ \
  -d "username=mobile"

curl -i -X POST http://localhost:8001/consumers/web/key-auth/ \
  -d 'key=da5f88bf-8a4f-4434-9741-e2196d9410ab'

curl -i -X POST http://localhost:8001/consumers/mobile/key-auth/ \
  -d 'key=c273febb-46a8-44ce-a181-0f5c1e0a1df0'

curl -i -X POST http://localhost:8001/consumers/web/plugins \
  -d "name=rate-limiting" \
  -d "config.minute=5" \
  -d "config.minute=100"

curl -i -X POST http://localhost:8001/consumers/mobile/plugins \
  -d "name=rate-limiting" \
  -d "config.minute=5" \
  -d "config.minute=100"