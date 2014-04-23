jQueryMXNotice
==============

###[Демо-страница](http://milaxcom.github.io/jQueryMXNotice/demo/) | [Скачать](https://github.com/milaxcom/jQueryMXNotice/archive/gh-pages.zip)

jQuery MXNotice предназначен для отображения уведомлений на странице с помощью JS.

####Преимущества
- Работа с любой версией jQuery начиная с 1.4.0 (тестировался на 1.11.0).
- Комплектуется 2мя стилями отображения.
- Для стилей по-умолчанию не требуется подключение изображений и CSS.
- Совместим с ie6+.
- Очередь сообщений.

Сам код плагина очень мал, основная его часть — это два стиля отображения сообщений. Плагин создавался, как:
- Каркас для создания «нотификаторов» под каждый проект;
- Набор стандартных стилей для не больших проектов.


###Подключение

```html
<script type="text/javascript" src="js/jquery-1.11.0.min.js"></script>
<script type="text/javascript" src="js/jquery.mxnotice.min.js"></script>
```

Для типа отображения ```default``` используется FIX для ie6, но он не будет срабатывать без jQuery-объекта $.browser, который был удален из версии jQ начиная с 1.9.0. Рекомендуется использовать сторонний планиг https://github.com/gabceb/jquery-browser-plugin.

###Использование в META

Дает возможность запускать сообщения без JS-метода.

```html
<meta name="mxnotice:type" content="default">
<meta name="mxnotice:status" content="info">
<meta name="mxnotice:caption" content="Lorem Ipsum">
<meta name="mxnotice:message" content="Lorem Ipsum is simply dummy text of the printing and typesetting industry.">
```

```mxnotice:type``` — тип отображения, по-умолчанию ```default```, можно не указывать.

```mxnotice:status``` — стиль ```info|error|success```, по-умолчанию ```info```, можно не указывать.

```mxnotice:caption``` и ```mxnotice:message``` — составные части сообщения

Можно задавать свои опции ```mxnotice:*```, если они будут использоваться обработчиком.

###Использование в JS

```js
var alert = {
  "type"			: "default",
  "status"			: "success",
  "caption"			: "Lorem Ipsum",
  "message"			: "Lorem Ipsum is simply dummy text of the printing and typesetting industry."
};

MXNotice( alert );
```

###Стиль отображения topshot (на примере)

```js
var alert = {
  "type"			: "topshot",
  "status"			: "success",
  "message"			: "Lorem Ipsum is simply dummy text of the printing and typesetting industry."
};

MXNotice( alert );
```

В стиле отображения topshot используется только ```message```.
