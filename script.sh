lsof -i :6789 -sTCP:LISTEN |awk 'NR > 1 {print $2}'  |xargs kill -15

#kill -9 26293