/**
 * jQueryMXNotice v1.0
 *
 * Copyright 2014 Milax
 * http://www.milax.com/
 *
 * Author
 * Maksim Gusakov
 */


/** 
 * Стартовый-пользовательский метод для вызова сообщения.
 * 
 * @param	object	data			Объект-масив со значениями сообщения.
 */
MXNotice = function ( data ) {
	
	if ( typeof data == "undefined" ) {
		/** Стартовый метод вызова — собирает очередь из meta */
		
		var $meta = $("meta[name ^= 'mxnotice']");
		var data = {};
		var name, param;

		for (var i = 0; i < $meta.length; i++) {
			name 			= $meta.eq(i).attr("name").substr(9);
			content 		= $meta.eq(i).attr("content");
			data[ name ] = content;
		}

		MXNotice._addQueue( data );

	} else {
		/** Стандартный метод вызова — добавляет сообщение в очередь */

		MXNotice._addQueue( data );

	}
	
	/** Выводим первое сообщение из очереди */
	MXNotice._exec();

};

/** Стиль сообщений по-умолчанию */
MXNotice._defaultType = "default";
/** Масив, содержащий список сообщений в виде объектов. */
MXNotice._queue = [];
/** Объект для содержания таймаутов закрытия. */
MXNotice._timeout = 0;

/** Шаблоны нотисов */
MXNotice._types = {

	"default" : {
		"tmpl"				: '<div class="mx-notice"><span class="mx-notice-close"><img class="mx-notice-close-image" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAQAAACR313BAAAAbElEQVR4AYWP0Q2AMAgFO492nnYc2EAGNkFJ8+LFn8KPjzsDbavyyMZWXsHzzgE43uzCnlVLEKzywr0ChIHcy54YXPie2v0JSSgMgbCwOoBD093f+928PP6Xdw4o690G2CCYdpsgBOPlJyDyA4JTSSwL8/JhAAAAAElFTkSuQmCC"></span><span class="mx-notice-caption"></span></div>',
		"timeout"			: 6000,
		"css"				: {
			"notice"			: {
				"width"					: "348px",
				"position"				: "fixed",
				"left"					: "50%",
				"margin-left"			: "-212px",
				"top"					: 0,
				"font-size"				: "14px",
				"padding"				: "28px 38px",
				"background-color"		: "#fff",
				"border-radius"			: "6px",
				"-webkit-box-shadow"	: "0px 6px 35px 0px rgba(0,0,0,0.6)",
				"-moz-box-shadow"		: "0px 6px 35px 0px rgba(0,0,0,0.6)",
				"box-shadow"			: "0px 6px 35px 0px rgba(0,0,0,0.6)",
				"text-align"			: "left",
				"color"					: "#666",
				"z-index"				: 9999999999
			},
			"caption"			: {
				"font-size"				: "22px",
				"color"					: "#666",
				"display"				: "block",
				"margin-bottom"			: "16px",
				"font-weight"			: "bold"
			},
			"close"				: {
				"display"				: "block",
				"position"				: "absolute",
				"top"					: "7px",
				"left"					: "auto",
				"right"					: "7px",
				"width"					: "13px",
				"height"				: "13px",
				"background-color"		: "#666",
				"border-radius"			: "50%",
				"cursor"				: "pointer",
				"opacity"				: "0.5"
			},
			"closeImage"				: {
				"display"				: "block",
				"position"				: "absolute",
				"top"					: "3px",
				"right"					: "3px",
				"width"					: "7px",
				"height"				: "7px"
			},
			"info"				: {
				"color"					: "#666"
			},
			"success"			: {
				"color"					: "#69ab54"
			},
			"error"				: {
				"color"					: "#dd5256"
			}
		},
		"build"				: function ( data ) {

			var $body = $( "body" );

			var $element = $( data.type.tmpl );
			var $caption = $(".mx-notice-caption", $element);
			var $close = $(".mx-notice-close", $element);

			/** Установка заголовка */
			if ( typeof data.caption == "undefined" )

				$caption.remove();

			else {

				$caption
					.css( data.type.css.caption )
					.text( data.caption );

				if ( typeof data.type.css[ data.status ] != "undefined" )
					$caption.css( data.type.css[ data.status ] );

			}

			/** Установка сообщения */
			if ( typeof data.message != "undefined" )
				$element.append( data.message );
			
			/** Бросаем сообщение в DOM */
			$element
				.css( data.type.css.notice )
				.data("data", data)
				.prependTo( $body );
			
			/** Позиционируем окно по вертикали */
			var height = $element.outerHeight();
			var cHeight = $body.height();
			var top = (cHeight / 2) - (height / 2);

			/** Позиционируем окно, показываем и вешаем ивенты на скрытие */
			$element
				.css( "top", top )
				.each( data.type.ie6fix )
				.each( data.type.onshow )
				.each( data.type.closeEvent );

			/** Вешаем обработчик на кнопку закрытия */
			$close
				.css ( data.type.css.close )
					.find ( ".mx-notice-close-image" )
					.css( data.type.css.closeImage );

		},
		"ie6fix"			: function () {

			/** Фикс для ие доступен, только если есть поддержка $.browser */
			if ( (typeof $.browser != "undefined") && ($.browser.version == "6.0") && ($.browser.msie) ) {
				
				$( this ).css({
					"position"			: "absolute",
					"top"				: "100px"
				});

			}

		},
		"closeEvent"		: function () {
			
			var $element = $( this );
			var data = $element.data( "data" );

			MXNotice._timeout = setTimeout(function () {
				$element.each( data.type.onhide );
			}, data.type.timeout);

			if ( !$element.hasClass("mx-notice-setevents") ) {

				$element.addClass("mx-notice-setevents");

				$element.on("mouseenter.mxnotice", function () {
					clearTimeout( MXNotice._timeout );
					$( this )
						.addClass("mxnotice-hover");
				}).on("mouseleave.mxnotice", function () {
					var newData = $( this ).data("data");
					$( this )
						.removeClass("mxnotice-hover")
						.each( newData.type.closeEvent );
				});

				$(document).on("click.mxnotice", function () {
					var newData = $element.data("data");
					if ( !$element.hasClass( "mxnotice-hover" ) ) {
						$element.each( newData.type.onhide );
					}
				});

				/** Обработчик кнопки закрытия */

				var $close = $( ".mx-notice-close", $element );

				var opacity = data.type.css.close.opacity;
				
				$close
					.data( "opacity", opacity )
					.on("mouseenter.mxnotice", function () {
						$( this ).animate( { "opacity" : 1 }, 100 );
					})
					.on("mouseleave.mxnotice", function () {
						$( this ).animate( { "opacity" : $( this ).data( "opacity" ) }, 100 );
					})
					.on("click.mxnotice", function () {
						var $parent = $( this ).parent();
						var newData = $parent.data("data");
						$parent.each( newData.type.onhide );
					});
			}

		},
		"onshow"			: function () {
			
			/** Показываем сообщение */
			$(this)
				.css({
					"top"				: "-=20px",
					"opacity"			: 0
				}).animate({
					"top"				: "+=20px",
					"opacity"			: 1
				}, 400, "linear");

		},
		"onhide"			: function () {
			
			/** Проверяем виден ли блок прежде чем его скрывать */
			if ( !$(this).filter(":visible").length ) return false;

			var data = $(this).data("data");
			
			$(this)
				.animate({
					"top"				: "+=20px",
					"opacity"			: 0
				}, 200, "linear", function () {
					/** Чистим событие на документе */
					$(document).off("click.mxnotice");
					
					$(this).remove();
					data.next();
				});

		}
	},

	"topshot" : {
		"tmpl"				: '<div class="mx-notice"><div class="mx-message"></div></div>',
		"timeout"			: 6000,
		"css"				: {
			"notice"			: {
				"width"					: "100%",
				"position"				: "fixed",
				"left"					: 0,
				"top"					: 0,
				"text-align"			: "left",
				"z-index"				: 9999999999
			},
			"message"			: {
				"padding"				: "28px 38px",
				"font-size"				: "22px",
				"color"					: "#fff",
				"font-weight"			: "bold",
				"text-align"			: "center",
				"text-shadow"			: "0px 1px 1px rgba(0, 0, 0, 0.3)"
			},
			"info"				: {
				"background-color"		: "#5fa6ce",
				"background-color"		: "rgba(95,166,206,0.8)"
			},
			"success"			: {
				"background-color"		: "#69ab54",
				"background-color"		: "rgba(105,171,84,0.8)"
			},
			"error"				: {
				"background-color"		: "#dd5256",
				"background-color"		: "rgba(221,82,86,0.8)"
			},
			"fixstatus"			: {
				"info"				: {
					"background-color"		: "#5fa6ce"
				},
				"success"			: {
					"background-color"		: "#69ab54"
				},
				"error"				: {
					"background-color"		: "#dd5256"
				}
			}
		},
		"build"				: function ( data ) {

			var $body = $( "body" );

			var $element = $( data.type.tmpl );
			var $message = $( ".mx-message", $element );

			/** Установка сообщения */
			if ( typeof data.message != "undefined" )
				$message
					.css( data.type.css.message )
					.append( data.message );

			/** Бросаем сообщение в DOM */
			$element
				.css( data.type.css.notice )
				.data("data", data)
				.prependTo( $body );
			
			/** Позиционируем окно за верхнюю границу */
			var height = $element.outerHeight();
			var top = (-1) * (height + 20);

			/** Позиционируем окно, показываем и вешаем ивенты на скрытие */
			$element
				.css( "top", top )
				.each( data.type.ie6fix )
				.each( data.type.onshow )
				.each( data.type.closeEvent );

			
			/** Установка статуса */
			if ( typeof data.type.css[ data.status ] != "undefined" ) {

				if ($.support.opacity) 
					$element.css( data.type.css[ data.status ] );
				else 
					$element.css( data.type.css.fixstatus[ data.status ] );

			}

		},
		"ie6fix"			: function () {

			/** Фикс для ие доступен, только если есть поддержка $.browser */
			if ( (typeof $.browser != "undefined") && ($.browser.version == "6.0") && ($.browser.msie) ) {
				
				$( this ).css({
					"position"			: "absolute"
				});

			}

		},
		"closeEvent"		: function () {
			
			var $element = $( this );
			var data = $element.data( "data" );

			MXNotice._timeout = setTimeout(function () {
				$element.each( data.type.onhide );
			}, data.type.timeout);

			if ( !$element.hasClass("mx-notice-setevents") ) {

				$element.addClass("mx-notice-setevents");

				$element.on("mouseenter.mxnotice", function () {
					clearTimeout( MXNotice._timeout );
					$( this )
						.addClass("mxnotice-hover");
				}).on("mouseleave.mxnotice", function () {
					var newData = $( this ).data("data");
					$( this )
						.removeClass("mxnotice-hover")
						.each( newData.type.closeEvent );
				});

				$(document).on("click.mxnotice", function () {
					var newData = $element.data("data");
					if ( !$element.hasClass( "mxnotice-hover" ) ) {
						$element.each( newData.type.onhide );
					}
				});

			}

		},
		"onshow"			: function () {
			
			/** Показываем сообщение */
			$(this)
				.animate({
					"top"				: 0
				}, 400, "linear");

		},
		"onhide"			: function () {
			
			/** Проверяем виден ли блок прежде чем его скрывать */
			if ( !$(this).filter(":visible").length ) return false;

			var data = $(this).data("data");

			var height = $(this).outerHeight();
			var top = (-1) * (height + 20);

			$(this)
				.animate({
					"top"				: top
				}, 200, "linear", function () {
					/** Чистим событие на документе */
					$(document).off("click.mxnotice");

					$(this).remove();
					data.next();
				});

		}
	}

};

/**
 * Метод добавляет данные в масив сообщений / очереди. 
 * 
 * @param	object	data	Объект с данными.
 */
MXNotice._addQueue = function ( data ) {

	MXNotice._queue.push( data );

};

/** Метод отвечает за непосредственный процесс вывода сообщения из очереди. */
MXNotice._exec = function () {

	/** Условия при которых не будет срабатывать обработчик */
	if ( !MXNotice._queue.length ) return false;
	if ( $( ".mx-notice" ).length ) return false;
	
	/** Выбираем первое сообщение из очереди + возможность значений по-умолчанию */
	var data = $.extend({
		"status" 			: "info",
		"type"				: MXNotice._defaultType,
		"next"				: MXNotice._exec
	}, MXNotice._queue.shift() );
	
	/** Работаем со стилем по-умолчанию, если нет указанного */
	if ( typeof MXNotice._types[ data.type ] == "undefined" )
		data.type = MXNotice._defaultType;
	
	var typeName = data.type;

	/** Ссылка на объект стиля — для удобства */
	data.type = MXNotice._types[ data.type ];
	
	if ( typeof data.type.build == "undefined" ) {
		console.error("Required parameter is missing: method build() in type " + typeName);
		return false;
	}

	/** Вызов строителя */
	data.type.build( data );

};

/** Стартуем плагин на DOM-Ready */
$(function () {
	MXNotice();
});


/** END */