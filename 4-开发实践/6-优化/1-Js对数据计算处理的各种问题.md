# Js对数据计算处理的各种问题

## 1.问题再现

**(1)parseInt()最好不用**

不要将 parseInt 当做转换 Number 和 Integer 的工具。

问题：默认，对小于 0.0000001 （1e-7） 的数字转换成 String 时，js会将其变成 科学记号法 ，再对这个数进行 parseInt 操作就会导致问题发生。即：

```
parseInt(0.0000008) === 8
```

解析：

常见的问题有浮点数比较：

```
console.log((0.1 + 0.2) == 0.3);  // false
console.log((0.1 + 0.2) === 0.3); // false
console.log(0.1 + 0.2); // 0.30000000000000004
```

再有：

```
parseInt(1000000000000000000000.5, 10); // 1
```

parseInt 的第一个类型是字符串，所以会将传入的参数转换成字符串，也就是 String(1000000000000000000000.5) 的结果为 '1e+21' 。 parseInt 并没有将 'e' 视为一个数字，所以在转换到就停止了。

这也就可以解释 parseInt(0.0000008) === 8 ：

```
String(0.000008);  // '0.000008'
String(0.0000008); // '8e-7'
```

参考： http://www.tuicool.com/articles/7nMbea

**(2)对于大数据，js有限制**

问题：

第三方api提供的数据：

```
{"content": "Hi", "created_at": 1340863646, "type": "text", "message_id": 5758965507965321234, "from_user": "userC"}
```

其中message_id是19位number类型的。我用JSON.parse解析成JSON对象获取其中的信息，方法如下：

```
var jsonStr = '{"content": "Hi", "created_at": 1340863646, "type": "text", "message_id": 5758965507965321234, "from_user": "userC"}';
var jsonObj = JSON.parse(jsonStr);
console.log(jsonObj.message_id);//得到结果是：5758965507965321000
```

得到的结果的最后三位变成000了。超过16位的数据解析后均会变为000；

解析：

浮点数范围：

```
as  large  as ±1.7976931348623157 × 10的308次方
as small as ±5 × 10的−324次方
```

精确整数范围：

```
The JavaScript number format allows you to exactly represent all integers between
−9007199254740992  and 9007199254740992 （即正负2的53次方）
```

数组索引还有位操作：

```
正负2的31次方
```

参考：

https://cnodejs.org/topic/4ff679c84764b7290214460a

https://cnodejs.org/topic/4fb3722c1975fe1e132b5a9a

## 2.终极答案

使用 [node-bignum][] ，地址：https://github.com/Ebookcoin/node-bignum

社区出现了很多bignumber包，但只有[node-bignum][]可以完美解决上述问题。诸如 [bignumber.js][] 等无法解决小数问题（问题1）。

[node-bignum]: https://github.com/Ebookcoin/node-bignum
[bignumber.js]: https://github.com/MikeMcl/bignumber.js
