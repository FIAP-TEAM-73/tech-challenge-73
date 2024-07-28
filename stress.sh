#!/bin/bash
for i in { 1..10000}; do
   curl -i -X GET \
 '${host}/api/v1/item?page=1&size=10'
   sleep $1
done