ssh -i /path/to/key.pem ec2-user@your-ec2-ip 'cd /path/to/annpick && git pull && npm install && pm2 restart all'
