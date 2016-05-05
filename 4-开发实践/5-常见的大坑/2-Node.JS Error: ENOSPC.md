# Node.JS Error: ENOSPC

## 错误描述

这个错误，意思是“驱动器没有空间”。很多人建议删除`tmp`文件夹下的东西，或把`tmp`转移到另一个大点的地方。事实上，对于ubuntu系统，只要一个简单的命令即可。

## 解决办法

```
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```

For Arch Linux add fs.inotify.max_user_watches=524288 to /etc/sysctl.d/99-sysctl.conf and then execute sysctl --system. This will also persist across reboots.

## 参考

http://stackoverflow.com/questions/22475849/node-js-error-enospc