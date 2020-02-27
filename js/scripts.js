$(document).ready(function () {
  init();
  style();
})

function init() {
  function swiper_init() {
    if ($('.main-page').length > 0) {
      if ($('.actions_slider .swiper-slide').length > 1) {
        var actions_slider = new Swiper('.actions_slider', {
          spaceBetween: 20,
          loop: true,
          autoplay: {
            delay: 5000,
            disableOnInteraction: false,
          },
          pagination: {
            el: '.swiper-pagination',
            type: 'fraction',
          },
          navigation: {
            nextEl: '.swiper-button-next',
          },
          on: {
            slideChange: function () {
              $('.fill').removeClass('active');
              setTimeout(function () {
                $('.fill').addClass('active');
              }, 300);
            }
          }
        })
      }

      var tariffs_slider = undefined;
      function tariffs_init() {
        var screenWidth = $(window).width();
        if (screenWidth > 1239 && tariffs_slider == undefined) {
          tariffs_slider = new Swiper('.best-tariffs-slider', {
            followFinger: false,
            slidesPerView: 'auto',
            centeredSlides: true,
            loop: true,
            slideToClickedSlide: true,
            effect: 'coverflow',
            coverflowEffect: {
              rotate: 0,
              stretch: 150,
              depth: 160,
              slideShadows: false,
            },
            pagination: {
              el: '.swiper-pagination',
              clickable: true,
            }
          });
        } else if (screenWidth < 1238 && tariffs_slider != undefined) {
          tariffs_slider.destroy();
          tariffs_slider = undefined;
        }
      }
      $(window).on('load resize', function () {
        tariffs_init();
      });
    }
    if ($('.about-page').length > 0) {
      var awards_slider = new Swiper('.awards-slider', {
        spaceBetween: 25,
        slidesPerView: 1.2,
        navigation: {
          nextEl: '.awards-button-next',
          prevEl: '.awards-button-prev',
        },
        breakpoints: {
          980: {
            slidesPerView: 3,
          },
          520: {
            slidesPerView: 2,
          },
        }
      });
      var licenses_slider = new Swiper('.licenses-slider', {
        spaceBetween: 30,
        slidesPerView: 1.2,
        navigation: {
          nextEl: '.licenses-button-next',
          prevEl: '.licenses-button-prev',
        },
        breakpoints: {
          1430: {
            slidesPerView: 3.3,
          },
          1239: {
            slidesPerView: 2.6,
          },
          768: {
            slidesPerView: 2.3,
          },
          520: {
            slidesPerView: 1.7,
          },
        }
      });
    }
  }
  swiper_init();
}

function style() {
  $(function () { // soft_scroll
    $("a[href^='#']").click(function () {
      var _href = $(this).attr("href");
      $("html, body").animate({ scrollTop: $(_href).offset().top - 100 + "px" });
      return false;
    });
  });

  if ($('.top-banner').length > 0) {
    function wave_anim() {
      $(window).on('scroll load', function () {
        if ($(window).scrollTop() + $(window).height() > ($('.top-banner').offset().top)) {
          $('.top-banner-bubble').addClass('active');
        }
      })
    }
    wave_anim();
  }

  if ($('.steps').length > 0) {
    function steps_anim() {
      $(window).on('scroll load', function () {
        if ($(window).scrollTop() + $(window).height() > ($('.steps').offset().top) + 200) {
          $('.steps-block-item:first-child').addClass('active');
          $('.steps-block-item:not(.active)').each(function (i, el) {
            setTimeout(function () {
              $(el).addClass('active')
            }, 3000 + (i * 3000));
          })
        }
      })
    }
    steps_anim();
  }

  $('.docs-download-block .docs-download-block-more').on('click', function () {
    $('.docs-download-block .docs-download-block-item').show();
    $(this).remove();
  })
  $('.page-nav-item-open a').on('click', function () {
    $('body').css('overflow', 'hidden');
  })
  $('.inner .close').on('click', function () {
    $('body').css('overflow', 'scroll');
  })

  $(document).on('click', '.important-block-item-title', function () {
    $(this).parent().siblings().removeClass('active');
    $(this).parent().siblings().find('.important-block-item-desc').slideUp();
    $(this).parent().toggleClass('active');
    $(this).parent().find('.important-block-item-desc').slideToggle();
  })

  $('#phone').inputmask({
    mask: '+7 (999) 999-99-99',
    showMaskOnHover: false
  });

  $('#popup_phone').inputmask({
    mask: '+7 (999) 999-99-99',
    showMaskOnHover: false
  });

  $('.popup-block-form-input.email input').blur(function () {
    if ($(this).val().length !== 0) {
      $(this).addClass('filled');
    } else {
      $(this).removeClass('filled');
    }
  });

  function burger() {
    $('.header-mb-button').on('click', function () {
      $('body').css('overflow', 'auto');
      $(this).toggleClass('active');
      $('.header-mb-wrapper').toggleClass('active');
      if ($('.header-mb-wrapper').hasClass('active')) {
        $('body').css('overflow', 'hidden');
      }
    });
  }
  burger();

  if ($('.about-page').length > 0) { // about_page scripts
    $("[data-fancybox]").fancybox({
      animationeffect: false
    });
  }

  if ($('.bonuses-page').length > 0) { // bonuses_page scripts
    function setLocation_bonuses(curLoc) {
      try {
        history.pushState(null, null, curLoc);
        return;
      } catch (e) { }
      location.hash = '#' + curLoc;
    }
    function bonuses_filter() {
      $('.bonuses-filter-item').on('click', function () {
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
        var cat_name = $(this).attr('category');
        //setLocation_bonuses(cat_name);
        $.ajax({
          type: "POST",
          url: "/local/templates/main/include/pages/bonuses/ajax/bonuses_list/index.php",
          data: ({
            "FILTER": cat_name
          }),
          success: function (result) {
            $(".cat_block").html(result);
          }
        });

      })
    }
    bonuses_filter();
  }

  if ($('.help-page').length > 0) { // help_page scripts
    $('.wrapper').css('overflow', 'visible'); // position: sticky fix (on page load)
    $('.info-titles-item-name').on('click', function () {
      let list_index = $(this).attr('list-index');
      $(this).siblings().removeClass('active');
      $(this).parents().siblings('.info-titles-item').find('.info-titles-item-name.active').removeClass('active');
      $(this).addClass('active');
      $(this).parents().siblings('.info-content').find('.info-content-item.active').removeClass('active');
      $("#" + list_index).addClass('active');
    })

    if ($(window).width() <= 979) {
      $('.wrapper').css('overflow', 'hidden'); // position: sticky fix (on page load)
      let header_h = $('header').height();
      $('.info-titles-item-name').on('click', function () {
        let item_h = $('.info-content-item.active').offset().top;
        total_height = item_h - header_h * 2;
        $("html, body").animate({ scrollTop: total_height + 'px' });
      })
      $('.info-content-item-title').on('click', function () {
        let item_h = $('.info-titles-item-name.active').offset().top
        total_height = item_h - header_h * 2;
        $("html, body").animate({ scrollTop: total_height + 'px' });
      })
    }

    $(window).resize(function () { // position: sticky fix (on page resize)
      if ($(window).width() <= 979) {
        $('.wrapper').css('overflow', 'hidden');
      } else {
        $('.wrapper').css('overflow', 'visible');
      }
    })
  }

  if ($('.journal-page').length > 0) { // journal_page scripts
    function setLocation(curLoc) {
      try {
        history.pushState(null, null, curLoc);
        return;
      } catch (e) { }
      location.hash = '#' + curLoc;
    }
    function journal_filter() {
      $('.articles-filter-item').on('click', function () {
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
        var cat_name = $(this).attr('category');
        //setLocation(cat_name);
        $.ajax({
          type: "POST",
          url: "/local/templates/main/include/pages/news/ajax/journal_list/index.php",
          data: ({
            "FILTER": cat_name
          }),
          success: function (result) {
            $(".cat_block").html(result);
          }
        });

      })
    }
    journal_filter();
  }

  if ($('.main-page').length > 0) { // main_page scripts
    function main_scroll_anim() {
      $(window).on('scroll', function () {
        if ($(window).scrollTop() > ($('.mobile_app').offset().top - 400)) {
          $('.mobile_app-image').addClass('active');
        }
      })
    }
    main_scroll_anim();

    function main_awards_more() {
      $('.features-awards-more').on('click', function () {
        $(this).fadeOut().siblings().find('.features-awards-block-item').fadeIn();
      })
    }
    main_awards_more();
  }

  if ($('.partner-program-page').length > 0) { // partner_program_page scripts
    // вид карта/список
    $('.atms-address-btns-item').on('click', function () {
      $('.atms-address-btns-item').removeClass('active');
      $(this).addClass('active');
      $('.atms-address-content-box').removeClass('active').eq($(this).index()).addClass('active');
      $('.atms-address-map-baloon').removeClass('active');
    });

    //карта
    ymaps.ready(init);
    function init() {
      var myMap = new ymaps.Map('atms_map', {
        center: [58.337364, 82.861901],
        zoom: 3,
        controls: ['zoomControl', 'fullscreenControl']
      }),
        objectManager = new ymaps.ObjectManager({
          clusterize: true,
          gridSize: 100,
          clusterDisableClickZoom: false
        }),
        myClaster = new ymaps.Clusterer({
          clusterIconLayout: ymaps.templateLayoutFactory.createClass('<div class="map_clust_d"></div>')
        });

      myMap.behaviors.disable('scrollZoom');
      objectManager.objects.options.set('preset', 'islands#redCircleIcon');
      myClaster.options.set('preset', 'islands#redClusterIcons');
      myMap.geoObjects.add(objectManager);

      $.ajax({
        url: "/local/templates/main/include/pages/departments/data.json"
      }).done(function (data) {
        objectManager.add(data);
        objectManager.setFilter('properties.partners == "no"');
      });

      if ($(window).width() < 767) {
        var mapSlider = new Swiper('.atms-address-map-baloon', {
          direction: 'vertical',
          allowSlideNext: false,
          grabCursor: true,
          initialSlide: 1,
          on: {
            slideChange: function () {
              $('.atms-address-map-baloon').removeClass('active');
            }
          }
        });

        objectManager.objects.events.add('click', function () {
          mapSlider.allowSlideNext = true;
          mapSlider.slideTo(1);
          mapSlider.allowSlideNext = false;
        });
      }

      objectManager.objects.events.add('click', function (e) {
        $('.atms-map-baloon').addClass('active');
        var objectId = e.get('objectId');
        var objectType = objectManager.objects.getById(e.get("objectId")).properties.type;
        var objectName = objectManager.objects.getById(e.get("objectId")).properties.name;
        var objectAddress = objectManager.objects.getById(e.get("objectId")).properties.address;
        var objectTime = objectManager.objects.getById(e.get("objectId")).properties.time;
        $('#atms_baloon_type').html(objectType);
        $('#atms_baloon_name').html(objectName);
        $('#atms_baloon_addr').html(objectAddress);
        $('#atms_baloon_time').html(objectTime);
      });
      $('.atms-map-baloon-content').mCustomScrollbar({
        axis: "y"
      });
      $('.atms-map-baloon-btn').on('click', function () {
        $('.atms-map-baloon').removeClass('active');
      });
    }

    // поиск адреса
    var availableTags = [
      'Адрес1',
      'Адрес2',
      'Адрес3',
      'Адрес4',
      'Адрес5',
      'Адрес6',
    ];

    $('input[name="atms_city"]').each(function () {
      var curr = $(this),
        addressContainer = $(this).closest('.atms-option-sity');

      curr.autocomplete({
        source: availableTags,
        appendTo: addressContainer
      })
    });

    $('input[name="atms_city"]').on('keyup', function () {
      $('.atms-option-sity-clear').addClass('active');

      if ($(this).prop("value").length == 0) {
        $('.atms-option-sity-clear').removeClass('active');
      }
    });

    $(document).on('click', '.atms-option-sity-clear', function () {
      $(this).siblings('#atms_city').val('');
      $(this).removeClass('active');
    });

  }

  if ($('.tariffs-page').length > 0) { // tariffs_page scripts
    $(document).on('click', '.tabs-block a', function () {
      $(this).siblings().removeClass('active');
      $(this).addClass('active');
      var page = $(this).attr("href");
      history.pushState({}, '', page);
      var page = page + '/';
      var text = $(this).data("nav");
      var title = $(this).data("title");
      $('.top-banner-content-breadcrumbs li:last-child span').html(text);
      $('h1').html(title);
      $.ajax({
        type: "POST",
        url: "/local/templates/main/include/pages/tariffs/ajax" + page + "index.php",
        success: function (msg) {
          $('#tariffs_tab').html(msg);
          $('#phone').inputmask({
            mask: '+7 (999) 999-99-99',
            showMaskOnHover: false
          });
        }
      });
      return false;
    });
  }

  // MARKETPLACE //

  if ($('.start-business-page').length > 0) { // start_business_page scripts
    $('.docs-block-title-item').on('click', function () {
      var index = $(this).index();
      $(this).siblings().removeClass('active');
      $(this).addClass('active');
      $(this).parent().siblings('.docs-block-content').find('.docs-block-content-item.active').removeClass('active');
      $(this).parent().siblings('.docs-block-content').find('.docs-block-content-item').eq(index).addClass('active');
    })
  }

  if ($('.all-tools-page').length > 0) { // all_tools_page scripts
    $('.switcher-block-title-item').on('click', function () {
      var index = $(this).index();
      $(this).siblings().removeClass('active');
      $(this).addClass('active');
      $(this).parent().siblings('.switcher-block-content').find('.switcher-block-content-box.active').removeClass('active');
      $(this).parent().siblings('.switcher-block-content').find('.switcher-block-content-box').eq(index).addClass('active');
      var page = $(this).data("link");
      history.pushState({}, '', page);
    })
  }

  $(document).on('click', '.articles-more', function () {
    var targetContainer2 = $('.cat_block');
    var cat_name = $('.articles-filter-item.active').attr('category');
    var targetContainer = $('.articles-block'), //  Контейнер, в котором хранятся элементы
      url = '?' + $('.articles-more').attr('data-url') + "&cat_name=" + cat_name; //  URL, из которого будем брать элементы
    if (url !== undefined) {
      $.ajax({
        type: 'GET',
        url: url,
        dataType: 'html',
        success: function (data) {  //  Удаляем старую навигацию
          $('.articles-more').remove();
          var elements = $(data).find('.articles-block-item'),  //  Ищем элементы
            pagination = $(data).find('.articles-more');  //  Ищем навигацию
          targetContainer.append(elements); //  Добавляем посты в конец контейнера
          targetContainer2.append(pagination);  //  добавляем навигацию следом
        }
      })
    }
  });

  $(document).on('click', '.cat_block .bonuses-more', function () {
    var targetContainer2 = $('.cat_block');
    var cat_name = $('.bonuses-filter-item.active').attr('category');
    var targetContainer = $('.bonuses-block'),  //  Контейнер, в котором хранятся элементы
      url = '?' + $('.bonuses-more').attr('data-url') + "&cat_name=" + cat_name;  //  URL, из которого будем брать элементы
    if (url !== undefined) {
      $.ajax({
        type: 'GET',
        url: url,
        dataType: 'html',
        success: function (data) {  //  Удаляем старую навигацию
          $('.bonuses-more').remove();
          var elements = $(data).find('.bonuses-block-item'), //  Ищем элементы
            pagination = $(data).find('.bonuses-more'); //  Ищем навигацию
          targetContainer.append(elements); //  Добавляем посты в конец контейнера
          targetContainer2.append(pagination);  //  добавляем навигацию следом
        }
      })
    }
  });

  $(document).on('click', '.cat_block_detail .bonuses-more', function () {
    var targetContainer2 = $('.cat_block_detail');
    var targetContainer = $('.bonuses-block'),  //  Контейнер, в котором хранятся элементы
      url = '?' + $('.bonuses-more').attr('data-url');  //  URL, из которого будем брать элементы
    if (url !== undefined) {
      $.ajax({
        type: 'GET',
        url: url,
        dataType: 'html',
        success: function (data) {  //  Удаляем старую навигацию
          $('.bonuses-more').remove();
          var elements = $(data).find('.bonuses-block-item'), //  Ищем элементы
            pagination = $(data).find('.bonuses-more'); //  Ищем навигацию
          targetContainer.append(elements); //  Добавляем посты в конец контейнера
          targetContainer2.append(pagination);  //  добавляем навигацию следом
        }
      })
    }
  });

  $(document).on('click', '.tariffs-top .tariffs-top-item', function () {
    $('.tariffs-top .tariffs-top-item').removeClass('active');
    $(this).addClass('active');
    var id = $(this).attr('data-id');
    $('.price_block').hide();
    $('.price_block.price_' + id).show();
  });
}
