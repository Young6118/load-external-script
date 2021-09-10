#! /bin/bash

projectName=`git remote -v | head -n1 | awk '{print $2}' | sed 's/.*\///' | sed 's/\.git//'`
projectFullHttpPath=`git remote -v | head -n1 | awk '{print $2}' | sed 's/.*@platgit/platgit/' | sed 's/\.git.*//' | sed 's/:/\//' `
currentTag=`git for-each-ref --sort=creatordate --format '%(refname:short)' | grep '^v' | sed -n '$p'`
previousTag=`git for-each-ref --sort=creatordate --format '%(refname:short)' | grep '^v' | sed -n 'x;$p'`
veryFirst=`git log --pretty=format:"%h" | sed -n '$p'`
[  -z "$previousTag" ] && previousTag=$veryFirst

echo $projectName
echo $previousTag"~"$currentTag

commitMsgs=`git log --pretty=format:'> [%s (%an)](https://'$projectFullHttpPath'/commit/%H)' $previousTag..$currentTag | grep -v 'ONLY FOR PRODUCTION' | grep -E -v 'v?\d+\.\d+\.\d+'`

#echo $commitMsgs

msgBody="#### ["$projectName"](http://plat-registry-npm.mihoyo.com/-/web/detail/"$projectName") upgrade to "$currentTag"\n\n"$commitMsgs

echo "$msgBody"
#https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=58f55f6b-6808-428b-9820-873aa8609f4d
curl 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=58f55f6b-6808-428b-9820-873aa8609f4d' \
   -H 'Content-Type: application/json' \
   -d '
   {
        "msgtype": "markdown",
        "markdown": {
            "content": "'"$msgBody"'"
        }
   }'

curl 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=58f55f6b-6808-428b-9820-873aa8609f4d' \
   -H 'Content-Type: application/json' \
   -d '
   {
        "msgtype": "text",
        "text": {
            "content": "",
            "mentioned_list": ["@all"]
        }
   }'