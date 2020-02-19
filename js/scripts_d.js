$(document).ready(function () {
    if ($('.departments-page').length > 0) {
        function city_sel(city, inp) {
            var sessid = $('input[name=sessid]').val();
            $.ajax({
                type: "POST",
                url: "/local/templates/main/include/pages/departments/ajax/city_cookie.php",
                data: ({
                    "city": city,
                    "sessid": sessid
                }),
                success: function (msg) {
                    const array = JSON.parse(msg);

                    var city_cookie = array;

                    if (city_cookie) {
                        var myGeocoder = ymaps.geocode(city_cookie);
                        myGeocoder.then(
                            function (res) {
                                var coordsMyAdr = res.geoObjects.get(0).geometry.getCoordinates();
                                myMap.setCenter(coordsMyAdr);
                                $('input[name=city_cookie_coord]').val(res.geoObjects.get(0).geometry.getCoordinates());
                            },
                            function (err) { }
                        );
                    }
                    //if(inp){}else{
                    $('[data-src="#popup_city"]').html(array);
                    //}
                    $('[name="city_cookie"]').val(array);
                    city_search();
                    $.fancybox.close();
                }
            });
        }

        function city_search(city_s) {
            var city = $('#city_search input[name="city"]').val();
            var sessid = $('input[name=sessid]').val();
            var city_cookie = $('input[name=city_cookie]').val();

            if (city_s) {
                var city_cookie = city_s;
            }

            if ($('.atms-sort-switch-btn').hasClass('active')) {
                var type = "o";
            } else {
                var type = "b";
            }

            if ($('.atms-tags-content-item #all_day').is(':checked')) {
                var timeAllDay = "y";
            } else {
                var timeAllDay = "n";
            }

            if ($('.atms-tags-content-item #all_time').is(':checked')) {
                var timeAllTime = "y";
            } else {
                var timeAllTime = "n";
            }

            if ($('.atms-tags-content-item #partners').is(':checked')) {
                var partners = "y";
            } else {
                var partners = "n";
            }
            if ($('.atms-tags-content-item #open_now').is(':checked')) {
                var open_now = "y";
            }


            $.ajax({
                type: "POST",
                url: "/local/templates/main/include/pages/departments/ajax/result_list.php",
                data: ({
                    "city": city_cookie,
                    "type": type,
                    "timeAllDay": timeAllDay,
                    "timeAllTime": timeAllTime,
                    "partners": partners,
                    "open_now": open_now,
                    "sessid": sessid
                }),
                success: function (msg) {
                    $('#result_list').html(msg);
                }
            });
            if (city_s) {
                var city_cookie = city_s.replace("г ", '');
                city_sel(city_cookie, 'y');
            } else {
                $.ajax({
                    type: "POST",
                    url: "/local/templates/main/include/pages/departments/ajax/city.php",
                    data: ({
                        "city": city,
                        "sessid": sessid
                    }),
                    success: function (msg) {
                        $('#city_filter').html(msg);
                    }
                });
            }
        }

        city_search();

        //fancybox
        $('.atms-sort-city a').fancybox({
            baseClass: "fs-city",
            padding: 0,
            margin: 0,
            touch: false,
        });
        $(document).on('click', '.popup_city-close', function () {
            $.fancybox.close();
        });

        // показать/скрыть фильтры
        $('.atms-option-filter_btn').on('click', function () {
            $('.atms-map-baloon').removeClass('active');
            $(this).text(($(this)).hasClass('active') ? 'Показать фильтры' : 'Свернуть фильтры');
            $(this).toggleClass('active');
            $('.atms-tags').slideToggle();
        });

        function closeFilterOption() {
            $('.atms-option-filter_btn').text('Показать фильтры');
            $('.atms-option-filter_btn').removeClass('active');
            $('.atms-tags').slideUp();
        }

        $('.atms-tags-btn').on('click', function () {
            closeFilterOption();
        });

        // вид карта/список
        $('.atms-option-view-btn').on('click', function () {
            $('.atms-option-view-btn').removeClass('active');
            $(this).addClass('active');
            $('.atms-tabs-content-box').removeClass('active').eq($(this).index()).addClass('active');
            $('.atms-map-baloon').removeClass('active');
            closeFilterOption();
        });

        //карта
        ymaps.ready(init);

        function init() {
            var city_cookie = $('input[name=city_cookie]').val();
            if (city_cookie) {
                var myGeocoder = ymaps.geocode(city_cookie);
                myGeocoder.then(
                    function (res) {
                        var coordsMyAdr = res.geoObjects.get(0).geometry.getCoordinates();

                        myMap.setCenter(coordsMyAdr);
                        // myPlacemark.geometry.setCoordinates(coordsMyAdr);
                        // myPlacemark.options.set('iconImageSize', [36, 36]);

                        $('input[name=city_cookie_coord]').val(res.geoObjects.get(0).geometry.getCoordinates());
                    },
                    function (err) { }
                );
            }
            var centerCords = [55.76, 37.64];
            var myMap = new ymaps.Map('atms_map', {
                center: centerCords,
                zoom: 10,
                controls: ['fullscreenControl']
            }, {
                searchControlProvider: 'yandex#search'
            }),

                // пользовательский макет zoom
                ZoomLayout = ymaps.templateLayoutFactory.createClass("<div class='ya_map-zoom'>" +
                    "<div id='zoom-in' class='ya_map-zoom-btn ya_map-zoom-btn-in'>+</div>" +
                    "<div id='zoom-out' class='ya_map-zoom-btn ya_map-zoom-btn-out'>-</div>" +
                    "</div>", {

                    build: function () {
                        ZoomLayout.superclass.build.call(this);
                        this.zoomInCallback = ymaps.util.bind(this.zoomIn, this);
                        this.zoomOutCallback = ymaps.util.bind(this.zoomOut, this);

                        $('#zoom-in').bind('click', this.zoomInCallback);
                        $('#zoom-out').bind('click', this.zoomOutCallback);
                    },

                    clear: function () {
                        $('#zoom-in').unbind('click', this.zoomInCallback);
                        $('#zoom-out').unbind('click', this.zoomOutCallback);

                        ZoomLayout.superclass.clear.call(this);
                    },

                    zoomIn: function () {
                        var map = this.getData().control.getMap();
                        map.setZoom(map.getZoom() + 1, {
                            checkZoomRange: true
                        });
                    },

                    zoomOut: function () {
                        var map = this.getData().control.getMap();
                        map.setZoom(map.getZoom() - 1, {
                            checkZoomRange: true
                        });
                    }
                }),
                zoomControl = new ymaps.control.ZoomControl({
                    options: {
                        layout: ZoomLayout
                    }
                }),

                objectManager = new ymaps.ObjectManager({
                    clusterize: true,
                    gridSize: 100,
                    clusterDisableClickZoom: false
                });

            // лого партнеров при клике на метку
            MyBalloonLayout = ymaps.templateLayoutFactory.createClass(
                '<div class="ya_map-baloon_icon">' +
                '<div class="arrow"></div>' +
                '$[[options.contentLayout observeSize minWidth=50 maxWidth=50 maxHeight=60]]' +
                '</div>', {

                build: function () {
                    this.constructor.superclass.build.call(this);
                    this._$element = $('.ya_map-baloon_icon', this.getParentElement());
                    this.applyElementOffset();
                },

                onSublayoutSizeChange: function () {
                    MyBalloonLayout.superclass.onSublayoutSizeChange.apply(this, arguments);
                    if (!this._isElement(this._$element)) {
                        return;
                    }
                    this.applyElementOffset();
                    this.events.fire('shapechange');
                },

                // Сдвигаем балун, чтобы "хвостик" указывал на точку привязки.
                applyElementOffset: function () {
                    this._$element.css({
                        left: -(this._$element[0].offsetWidth / 2),
                        top: -(this._$element[0].offsetHeight + this._$element.find('.arrow')[0].offsetHeight)
                    });
                },

                // Используется для автопозиционирования (balloonAutoPan).
                getShape: function () {
                    if (!this._isElement(this._$element)) {
                        return MyBalloonLayout.superclass.getShape.call(this);
                    }
                    var position = this._$element.position();
                    return new ymaps.shape.Rectangle(new ymaps.geometry.pixel.Rectangle([
                        [position.left, position.top],
                        [
                            position.left + this._$element[0].offsetWidth,
                            position.top + this._$element[0].offsetHeight + this._$element.find('.arrow')[0].offsetHeight
                        ]
                    ]));
                },

                _isElement: function (element) {
                    return element && element[0] && element.find('.arrow')[0];
                }
            }),

                MyBalloonContentLayout = ymaps.templateLayoutFactory.createClass(
                    '<div class="ya_map-baloon_icon-content"><img src="$[properties.balloonContent]" alt=""></img></div>'
                );

            // $('.for_biz-title').on('click', function () {
            //     console.log('ssd');
            // var  ss = objectManager.objects.getById(1).properties.balloonContent;
            // var  ss = objectManager.objects.overlays.getAll();
            // var  ss = objectManager.objects.overlays.getAll();
            // var  ss = objectManager.objects.balloon.open(objectId);
            // console.log(ss);
            // objectManager.objects.balloon.open(objects[i].id);
            // console.log(objectManager.objects.get(0);
            // });

            myMap.controls.add(zoomControl, {
                float: 'none',
                position: {
                    right: 25,
                    top: 190
                }
            });

            // myMap.events.add('actiontick', function () {
            //     var state = myMap.action.getCurrentState();
            //     console.log('zoom =', state.zoom);
            //     if (state.zoom >= 15) {
            //         console.log(1231)
            //     }
            // });

            function city_select(city) {
                var sessid = $('input[name=sessid]').val();
                $.ajax({
                    type: "POST",
                    url: "/local/templates/main/include/pages/departments/ajax/city_cookie.php",
                    data: ({
                        "city": city,
                        "sessid": sessid
                    }),
                    success: function (msg) {
                        const array = JSON.parse(msg);

                        var city_cookie = array;

                        if (city_cookie) {
                            var myGeocoder = ymaps.geocode(city_cookie);
                            myGeocoder.then(
                                function (res) {
                                    var coordsMyAdr = res.geoObjects.get(0).geometry.getCoordinates();
                                    myMap.setCenter(coordsMyAdr);
                                    $('input[name=city_cookie_coord]').val(res.geoObjects.get(0).geometry.getCoordinates());
                                },
                                function (err) { }
                            );
                        }

                        $('[data-src="#popup_city"]').html(array);
                        $('[name="city_cookie"]').val(array);
                        city_search();
                        $.fancybox.close();
                    }
                });
            }

            // $(window).keydown(function (e) {
            //     if (e.keyCode == 13) {

            //     }
            // });
            $('#atms_city').keydown(function (e) {
                if (e.keyCode === 13) {
                    var atms_city = $('input[name=atms_city]').val();
                    city_select(atms_city);
                    // alert(12);
                }
            });
            /*$(document).on('submit', '#search_city', function () {
                    var atms_city = $('input[name=atms_city]').val();
                    city_select(atms_city);
                    alert(12);
                return false;
            });*/
            $(document).on('click', '.popup_city-main-col-content-item a', function () {
                var citySelect = $(this).html();

                var city = $(this).attr("href");
                var city_name = $(this).html();
                history.pushState({}, '', '/atms-offices/' + city);
                $('.popup_geo_city').removeClass('active');
                $('.top-banner-content-breadcrumbs li:last-child span').html('ДелоБанк в городе ' + city_name);
                $("h1").html('ДелоБанк в городе ' + city_name);

                city_select(citySelect);
                return false;
            });

            $('.popup_geo_city-close').on('click', function () {
                $('.popup_geo_city').removeClass('active');
            });

            $('.popup_geo_city-button.no').on('click', function () {
                $('.popup_geo_city').removeClass('active');
            });
            $('.popup_geo_city-button.yes').on('click', function () {
                var citySelect = $(this).data("city");

                var city = $(this).data("url");
                var city_name = $(this).data("city");
                history.pushState({}, '', '/atms-offices/' + city);

                $("h1").html('ДелоБанк в городе ' + city_name);
                $('.top-banner-content-breadcrumbs li:last-child span').html('ДелоБанк в городе ' + city_name);
                $('.popup_geo_city').removeClass('active');
                city_select(citySelect);


            });

            $('.popup_geo_city-button.no').fancybox({
                baseClass: "fs-city",
                padding: 0,
                margin: 0,
                touch: false,
            });

            myMap.behaviors.disable('scrollZoom');

            objectManager.objects.options.set({
                iconLayout: 'default#image',
                iconImageHref: '/local/templates/main/img/icon_map_object.svg',
                //iconImageHref: '<div class="ya_map-baloon_icon-content"><img src="$[properties.balloonContent]" alt=""></img></div>',
                iconImageSize: [16, 16],
                iconImageOffset: [-8, -8],
                balloonShadow: false,
                balloonLayout: MyBalloonLayout,
                balloonContentLayout: MyBalloonContentLayout,
                balloonPanelMaxMapArea: 0
            });



            objectManager.clusters.options.set({
                clusterIconLayout: ymaps.templateLayoutFactory.createClass("<div class=\"ya_map-clusterer\">{{ properties.geoObjects.length }}</div>"),
                clusterIconShape: {
                    type: "Rectangle",
                    coordinates: [
                        [0, 0],
                        [50, 50]
                    ]
                },
            });

            myMap.geoObjects.add(objectManager);
            // myMap.geoObjects.add(myPlacemark);

            $.ajax({
                // url: "/local/templates/main/include/pages/departments/data.json"
                url: "/local/templates/main/include/pages/departments/data.json"
            }).done(function (data) {
                objectManager.add(data);
                objectManager.setFilter('properties.type == "Банкомат" && properties.partners == "no"');
                // ymaps.templateLayoutFactory.createClass(
                //     '<div class="ya_map-baloon_icon-content"><img src="$[properties.balloonContent]" alt=""></img></div>'
                // );
            });

            // suggestView.events.add('select', function (e) {
            //     var activeItem = e.get('item').value;
            //     var myGeocoder = ymaps.geocode(activeItem);

            //     // console.log(myMap.getCenter());
            //     // console.log(activeItem);

            //     myGeocoder.then(
            //         function (res) {
            //             var coordsMyAdr = res.geoObjects.get(0).geometry.getCoordinates();
            //             var bounds = res.geoObjects.get(0).properties.get('boundedBy');

            //             myMap.setCenter(coordsMyAdr);
            //             // myPlacemark.geometry.setCoordinates(coordsMyAdr);
            //             // myPlacemark.options.set('iconImageSize', [36, 36]);

            //             myMap.setBounds(bounds, {
            //                 checkZoomRange: true
            //             });
            //         },
            //         function (err) {}
            //     );
            // });
            var token = "f7cd59d270fa2905f74cf38f74981c3abbe346c8";
            $("#atms_city").suggestions({
                // Замените на свой API-ключ
                token: token,
                type: "ADDRESS",
                //hint: false,
                //bounds: "city",
                constraints: {
                    label: "",
                    locations: {
                        city_type_full: "город"
                    }
                },
                onSelect: function (suggestion) {
                    var data = suggestion.data;
                    var activeItem = suggestion.value;
                    var myGeocoder = ymaps.geocode(activeItem);
                    city_search(activeItem);
                    myGeocoder.then(
                        function (res) {
                            var coordsMyAdr = res.geoObjects.get(0).geometry.getCoordinates();
                            var bounds = res.geoObjects.get(0).properties.get('boundedBy');

                            myMap.setCenter(coordsMyAdr);
                            // myPlacemark.geometry.setCoordinates(coordsMyAdr);
                            // myPlacemark.options.set('iconImageSize', [36, 36]);

                            myMap.setBounds(bounds, {
                                checkZoomRange: true
                            });
                        },
                        function (err) { }
                    );
                }
            });

            $('#atms_city').on('click', function () { });

            // фильтры
            function filter_map() {
                city_search();
                var filter = '';

                if ($('.atms-sort-switch-btn').hasClass('active')) {
                    filter = 'properties.type == "Офис"';
                } else {
                    filter = 'properties.type == "Банкомат"';
                }

                if ($('.atms-tags-content-item #all_day').is(':checked')) {
                    filter += '&& properties.timeAllDay == "yes"';
                }

                if ($('.atms-tags-content-item #all_time').is(':checked')) {
                    filter += '&& properties.timeAllTime == "yes"';
                }

                if ($('.atms-tags-content-item #partners').is(':checked')) {
                    filter += '&& properties.partners == "yes"';
                } else {
                    filter += '&& properties.partners == "no"';
                }

                if ($('.atms-tags-content-item #open_now').is(':checked')) {
                    filter += '&& properties.open_now == "yes"';
                }

                objectManager.setFilter(filter);
            }

            $('.atms-sort-switch-btn').on('click', function () {
                $(this).toggleClass('active');
                $(this).siblings('.atms-sort-switch-txt').toggleClass('active');
                $('.atms-map-baloon').removeClass('active');
                filter_map();
            });

            $('.atms-tags-content-item #all_day').on('change', function () {
                filter_map();
            });

            $('.atms-tags-content-item #all_time').on('change', function () {
                filter_map();
            });

            $('.atms-tags-content-item #partners').on('change', function () {
                filter_map();
            });

            $('.atms-tags-content-item #open_now').on('change', function () {
                filter_map();
            });

            // if ($(window).width() < 767) {
            //     var mapSlider = new Swiper('.atms-address-map-baloon', {
            //         direction: 'vertical',
            //         allowSlideNext: false,
            //         grabCursor: true,
            //         initialSlide: 1,
            //         on: {
            //             slideChange: function () {
            //                 $('.atms-address-map-baloon').removeClass('active');
            //             }
            //         }
            //     });

            //     objectManager.objects.events.add('click', function () {
            //         mapSlider.allowSlideNext = true;
            //         mapSlider.slideTo(1);
            //         mapSlider.allowSlideNext = false;
            //     });
            // }

            $('.atms-map-baloon-content').mCustomScrollbar({
                axis: "y"
            });

            objectManager.objects.events.add('click', function (e) {
                closeFilterOption();
                $('.atms-map-baloon').addClass('active');
                var objectId = e.get('objectId');


                var objectType = objectManager.objects.getById(e.get("objectId")).properties.type;
                var objectName = objectManager.objects.getById(e.get("objectId")).properties.name;
                var objectPhone = objectManager.objects.getById(e.get("objectId")).properties.phone;
                var objectNameBank = objectManager.objects.getById(e.get("objectId")).properties.NameBank;
                var objectImg = objectManager.objects.getById(e.get("objectId")).properties.balloonContent;
                var objectAddress = objectManager.objects.getById(e.get("objectId")).properties.address;
                var objectTime = objectManager.objects.getById(e.get("objectId")).properties.time;
                var objectMetro = objectManager.objects.getById(e.get("objectId")).properties.metro;
                var objectCoords = objectManager.objects.getById(e.get("objectId")).geometry.coordinates;
                var partners = objectManager.objects.getById(e.get("objectId")).properties.partners;
                var metroNum = 10;

                // $('#atms_baloon_type').html(objectType);
                if (objectType == 'Банкомат') {
                    $('#limit_list').show();
                } else {
                    $('#limit_list').hide();
                }

                if (objectType == 'Банкомат') {
                    $('#atms_baloon_phone').hide();
                    $('#atms_baloon_phone').html('');
                } else {
                    $('#atms_baloon_phone').html(objectPhone);
                    $('#atms_baloon_phone').show();
                }

                $('#name_bank').html(objectNameBank);
                $('#img_bank').html('<img src="' + objectImg + '" alt="' + objectNameBank + '">');


                $('#atms_baloon_name').html(objectName);
                $('#atms_baloon_addr').html(objectAddress);

                if (objectTime == '') {
                    $('#atms_baloon_time').hide();
                    $('#atms_baloon_time').html('');
                } else {
                    $('#atms_baloon_time').html(objectTime);
                    $('#atms_baloon_time').show();
                }

                if (partners == 'no') {
                    $('#limit_list').hide();
                } else {
                    $('#limit_list').show();
                }

                //$('#atms_baloon_time').html(objectTime);

                $('#atms_baloon_metro').html(objectMetro);

                // ymaps.geocode(objectCoords, {kind: 'metro', results: metroNum}).then(function(res) {

                //     res.geoObjects.options.set('preset', 'islands#redCircleIcon');

                //     for(var i=0; i<metroNum; i++) {
                //         var coordsMetro = res.geoObjects.get(i).geometry.getCoordinates();
                //         var distance = ymaps.coordSystem.geo.getDistance(objectCoords, coordsMetro);
                //         console.log(distance);
                //         console.log(res.geoObjects.get(i).getPremise());

                //         myMap.geoObjects.add(res.geoObjects);
                //     }
                // });





                // console.log(objectCoords);

                // var baloonGeocoder = ymaps.geocode(objectCoords, {
                //     kind: 'metro',
                //     results: 1
                // });


                // baloonGeocoder.then(
                //     function (res) {
                //         // res.geoObjects.options.set('preset', 'islands#redCircleIcon');
                //         // res.geoObjects.events
                //         //     .add('mouseenter', function (event) {
                //         //         var geoObject = event.get('target');
                //         //         // console.log(geoObject.geometry.getCoordinates(), geoObject.getPremise());

                //         //         console.log( geoObject.getPremise());
                //         //     })
                //         // // Добавляем коллекцию найденных геообъектов на карту.
                //         // myMap.geoObjects.add(res.geoObjects);
                //     },
                //     function (err) {}
                // );

                // ymaps.geocode(objectCoords, {
                //     kind: 'metro',
                //     // kind: "route",
                //     results: 1
                // }).then(function (res) {
                //         res.geoObjects.options.set('preset', 'islands#redCircleIcon');
                //         // res.geoObjects.events
                //         //     .add('mouseenter', function (event) {
                //         //         var geoObject = event.get('target');
                //         //         myMap.hint.open(geoObject.geometry.getCoordinates(), geoObject.getPremise());
                //         //         console.log(geoObject.properties._data.metaDataProperty);
                //         //     })
                //         //     // Скрываем хинт при выходе курсора за пределы метки.
                //         //     .add('mouseleave', function (event) {
                //         //         myMap.hint.close(true);
                //         //     });
                //         // myMap.geoObjects.add(res.geoObjects);
                //         // myMap.setBounds(res.geoObjects.getBounds());

                //         // console.log(res.geoObjects.get(0).geometry.getCoordinates());
                //         console.log(res.geoObjects.get(0).getPremise());
                //         // console.log(res.geoObjects.get(0));
                //         console.log(res.geoObjects.get(0)._xalEntities.thoroughfare);

                //         console.log(res.geoObjects.get(0).properties.getAll());
                //         // console.log(res.geoObjects.get(0).properties.getAll());
                //     });

                // var metro = new YMaps.Metro.Closest(new YMaps.GeoPoint(37.588162,55.733797), { results: 1 });
                // var metro = new ymaps.Metro.Closest(new ymaps.GeoPoint(37.588162,55.733797), { results : 3 } );
                // console.log(metro);
            });

            $('.atms-map-baloon-btn').on('click', function () {
                $('.atms-map-baloon').removeClass('active');
            });
        }

        $('input[name="atms_city"]').on('keyup', function () {
            $('.atms-option-sity-clear').addClass('active');

            if ($(this).prop("value").length == 0) {
                $('.atms-option-sity-clear').removeClass('active');
            }
        });

        $('#city_search input[name="city"]').on('keyup', function () {
            city_search();
        });


        $(document).on('click', '.atms-option-sity-clear', function () {
            $(this).siblings('#atms_city').val('');
            $(this).removeClass('active');
        });



    }
});
