$(document).ready(function () {
  function phone_validation() {
    $('#popup_phone').blur(function () {
      if ($(this).val().length !== 0) {
        $(this).addClass('filled');
      } else {
        $(this).removeClass('filled');
      }
    });
    $('#phone').blur(function () {
      if ($(this).val().length !== 0) {
        $(this).addClass('filled');
      } else {
        $(this).removeClass('filled');
      }
    });
  }
  phone_validation();
  $('#open_account_step1_page').parsley();
})
function thank_account() {
  var sessid = $('input[name=sessid]').val();
  var hash = $('input[name=hash]').val();
  $.ajax({
    type: "POST",
    url: "/local/templates/main/include/pages/open_account/ajax/thank.php",
    data: ({
      "sessid": sessid,
      "hash": hash
    }),
    success: function (msg) {
      $('#result').html(msg);
    }
  });
}
$(window).keydown(function (e) {
  if ($('.popup_wrapper').hasClass('active')) {
    if (e.keyCode == 27) {
      $('.popup_wrapper').removeClass('active');
      $('body').css('overflow', 'scroll');
    }
  }
  if (e.keyCode == 27) {
    $.fancybox.close();
  }
});

$(document).on("click", ".tariffs .tariffs-block-item", function () {
  $('.popup_wrapper.rko').addClass('active');
  $('body').css('overflow', 'hidden');
  var id = $(this).attr('data-id');
  $('input[name=tariff]').val(id);
  return false;
});

$(document).on("click", ".best-tariffs-slider .swiper-slide-item-button", function () {
  $('.popup_wrapper.rko').addClass('active');
  $('body').css('overflow', 'hidden');
  var id = $(this).attr('data-id');
  $('input[name=tariff]').val(id);
  return false;
});

$(document).on("click", ".open-account", function () {
  $('.popup_wrapper.rko').addClass('active');
  setTimeout(() => {
     $('#popup_phone').focus();
   },  200);  
  return false;
});

$(document).on("click", ".open-mail-to-bank", function () {
  $('.popup_wrapper.feedback').addClass('active');
  $('#mail_to_bank').parsley();
  $('#phone_mail, #name_mail').blur(function () {
    if ($(this).val().length !== 0) {
      $(this).addClass('filled');
    } else {
      $(this).removeClass('filled');
    }
  });
  $('#phone_mail').inputmask({
    mask: '+7 (999) 999-99-99',
    showMaskOnHover: false
  });
  $("#topic").selectmenu();
  $('#file').bind('change', function () {
    var filename = $("#file").val();
    if (/^\s*$/.test(filename)) {
      $("#noFile").text("Прикрепить файл к сообщению");
    }
    else {
      $("#noFile").text(filename.replace("C:\\fakepath\\", ""));
    }
  });

  // Замените на свой API-ключ
  var token = "f7cd59d270fa2905f74cf38f74981c3abbe346c8";

  function join(arr /*, separator */) {
    var separator = arguments.length > 1 ? arguments[1] : ", ";
    return arr.filter(function (n) { return n }).join(separator);
  }

  function showSuggestion(suggestion) {
    $("label[for=company_name]").text("Название компании");
    $(".popup-block-form-input.company").show();

    var data = suggestion.data;
    if (!data)
      return;

    $("#company_name_mail").val(join([data.name.full_with_opf]));
    $("#company_inn_mail").val(join([data.inn]));
    $("#company_ogrn_mail").val(join([data.ogrn]));
    if ($("#company_name_mail").val !== 0) {
      $("#company_name_mail").removeClass('parsley-error');
    }
    if ($("#company_inn_mail").val !== 0) {
      $("#company_inn_mail").removeClass('parsley-error');
    }
    if ($("#company_ogrn_mail").val !== 0) {
      $("#company_ogrn_mail").removeClass('parsley-error');
    }
  }

  $("#company_name_mail").suggestions({
    token: token,
    type: "PARTY",
    count: 5,
    /* Вызывается, когда пользователь выбирает одну из подсказок */
    onSelect: showSuggestion
  });

  $("#company_inn_mail").suggestions({
    token: token,
    type: "PARTY",
    count: 5,
    /* Вызывается, когда пользователь выбирает одну из подсказок */
    onSelect: showSuggestion
  });

  $("#company_ogrn_mail").suggestions({
    token: token,
    type: "PARTY",
    count: 5,
    /* Вызывается, когда пользователь выбирает одну из подсказок */
    onSelect: showSuggestion
  });
  $("#name_mail").suggestions({
    token: token,
    type: "NAME",
    /* Вызывается, когда пользователь выбирает одну из подсказок */
    onSelect: function (suggestion) {
      console.log(suggestion);
      var $_count = parseInt($.trim($(this).val()).split(' ').length); // Подсчет слов
      if ($_count > 2) {
        $(this).removeClass('parsley-error');
      } else {
        $(this).addClass('parsley-error');
      }
      $('#name_mail').on('change keyup keydown', function () {
        var $_count = parseInt($.trim($(this).val()).split(' ').length); // Подсчет слов
        if ($_count > 2) {
          $(this).removeClass('parsley-error');
        } else {
          $(this).addClass('parsley-error');
        }
      });
    }
  });
  $("#email_mail").suggestions({
    token: token,
    type: "EMAIL",
    /* Вызывается, когда пользователь выбирает одну из подсказок */
    onSelect: function (suggestion) {
      if ($("#email_mail").val !== 0) {
        $(this).removeClass('parsley-error');
      } else {
        $(this).addClass('parsley-error');
      }
    }
  });


  return false;
});

$(document).on("click", ".popup_wrapper.feedback .popup-tabs .popup-tabs-item", function () {
  $(".popup_wrapper.feedback .popup-tabs .popup-tabs-item").removeClass('active');
  $(this).addClass('active');
  var type = $(this).attr('data-type');
  if (type == 11) {
    $('#mail_to_bank .company_info').show();
    $('#mail_to_bank .company_info input').attr('required', true);
  } else {
    $('#mail_to_bank .company_info').hide();
    $('#mail_to_bank .company_info input').attr('required', false);
  }
  return false;
});

$(document).on("submit", "#mail_to_bank", function () {
  var mist = 0;
  var phone = $('#mail_to_bank input[name=phone]').val();
  var sessid = $('input[name=sessid]').val();

  var fio = $('#mail_to_bank input[name=fio]').val();
  var email = $('#mail_to_bank input[name=email]').val();
  var organization_name = $('#mail_to_bank .company_info input[name=organization_name]').val();

  var type = $('.popup_wrapper.feedback .popup-tabs .popup-tabs-item.active').attr('data-type');

  $('#mail_to_bank input[name=type]').val(type);

  var topic = $('#mail_to_bank select[name=topic]').val();

  var organization_registration_number = $('#mail_to_bank .company_info input[name=organization_registration_number]').val();
  var organization_taxpayer_number = $('#mail_to_bank .company_info input[name=organization_taxpayer_number]').val();
  var text = $('#mail_to_bank textarea[name=text]').val();
  var agree = '';
  agree = $('#mail_to_bank input[name=checkbox]:checked').val();
  if (agree != 'y') {
    mist = mist + 1;
    $('#mail_to_bank input[name=checkbox]').parent().addClass("error");
  } else {
    $('#mail_to_bank input[name=checkbox]').parent().removeClass("error");
  }
  if (text != '') {
    $('#mail_to_bank textarea[name=text]').parent().removeClass("error");
  } else {
    $('#mail_to_bank textarea[name=text]').parent().addClass("error");
    mist = mist + 1;
  }

  if (phone != '') {
    $('#mail_to_bank input[name=phone]').parent().removeClass("error");
  } else {
    $('#mail_to_bank input[name=phone]').parent().addClass("error");
    mist = mist + 1;
  }
  if (fio != '') {
    $('#mail_to_bank input[name=fio]').parent().removeClass("error");
  } else {
    $('#mail_to_bank input[name=fio]').parent().addClass("error");
    mist = mist + 1;
  }
  if (email != '') {
    $('#mail_to_bank input[name=email]').parent().removeClass("error");
  } else {
    $('#mail_to_bank input[name=email]').parent().addClass("error");
    mist = mist + 1;
  }
  if (type == 11) {
    if (organization_name != '') {
      $('#mail_to_bank input[name=organization_name]').parent().removeClass("error");
    } else {
      $('#mail_to_bank input[name=organization_name]').parent().addClass("error");
      mist = mist + 1;
    }

    if (organization_registration_number != '') {
      $('#mail_to_bank input[name=organization_registration_number]').parent().removeClass("error");
    } else {
      $('#mail_to_bank input[name=organization_registration_number]').parent().addClass("error");
      mist = mist + 1;
    }
    if (organization_taxpayer_number != '') {
      $('#mail_to_bank input[name=organization_taxpayer_number]').parent().removeClass("error");
    } else {
      $('#mail_to_bank input[name=organization_taxpayer_number]').parent().addClass("error");
      mist = mist + 1;
    }
  }
  if (mist == 0) {
    var formData = new FormData(this);
    $.ajax({
      type: "POST",
      url: "/local/templates/main/include/pages/mail_to_bank/ajax/thank.php",
      data: formData,
      processData: false,
      contentType: false,
      // data: ({
      //   "type": type,
      //   "phone": phone,
      //   "fio": fio,
      //   "email": email,
      //   "organization_name": organization_name,
      //   "text": text,
      //   "topic": topic,
      //   "organization_registration_number": organization_registration_number,
      //   "organization_taxpayer_number": organization_taxpayer_number,
      //   "sessid": sessid
      // }),
      success: function (msg) {
        $(".popup_wrapper.feedback .popup-tabs").remove();
        $('#result_mail').html(msg);
      }
    });
  }
  return false;
});

$(document).on("click", ".page-nav-item-open", function () {
  $('.popup_wrapper.rko').addClass('active');
  setTimeout(() => {
     $('#popup_phone').focus();
   },  200);
  return false;
});

$(document).on('click', function (event) {
  if ($(event.target).closest(".popup_wrapper .inner, .ui-menu, .suggestions-suggestion").length) return;
  $('.popup_wrapper').removeClass('active');
  $('body').css('overflow', 'scroll');
  event.stopPropagation();
});

$(document).on('click', '.popup_wrapper.active .inner .close', function () {
  $('.popup_wrapper').removeClass('active');
  $('body').css('overflow', 'scroll');
  return false;
});

$(document).on("click", "#buttons_final", function () {
  $('.popup_wrapper').removeClass('active');
  $('body').css('overflow', 'scroll');
  return false;
});

$(document).on("submit", "#open_account_step1_page", function () {
  var mist = 0;
  var phone = $('#open_account_step1_page input[name=phone]').val();
  var sessid = $('input[name=sessid]').val();
  if (phone != '') {
    $('#open_account_step1_page input[name=phone]').parent().removeClass("error");
  } else {
    $('#open_account_step1_page input[name=phone]').parent().addClass("error");
    mist = mist + 1;
  }

  if (mist == 0) {
    $.ajax({
      type: "POST",
      url: "/local/templates/main/include/pages/open_account/ajax/status.php",
      data: ({
        "phone": phone,
        "sessid": sessid
      }),
      success: function (msg) {
        $('#result').html(msg);
        $('.popup_wrapper.rko').addClass('active');
        $('#popup_phone').inputmask({
          mask: '+7 (999) 999-99-99',
          showMaskOnHover: false
        });
        $('#popup_phone').blur(function () {
          if ($(this).val().length !== 0) {
            $(this).addClass('filled');
          } else {
            $(this).removeClass('filled');
          }
        });
        $("#tariff").selectmenu();
        $("#discount").selectmenu();

        // Замените на свой API-ключ
        var token = "f7cd59d270fa2905f74cf38f74981c3abbe346c8";

        function join(arr /*, separator */) {
          var separator = arguments.length > 1 ? arguments[1] : ", ";
          return arr.filter(function (n) { return n }).join(separator);
        }

        function showSuggestion(suggestion) {
          $("label[for=company_name]").text("Название компании");
          $(".popup-block-form-input.company").show();

          var data = suggestion.data;
          if (!data)
            return;

          $("#company_name").val(join([data.name.full_with_opf]));
          $("#company_inn").val(join([data.inn]));
          $("#company_ogrn").val(join([data.ogrn]));
        }

        $("#company_name").suggestions({
          token: token,
          type: "PARTY",
          count: 5,
          /* Вызывается, когда пользователь выбирает одну из подсказок */
          onSelect: showSuggestion
        });

        $("#company_inn").suggestions({
          token: token,
          type: "PARTY",
          count: 5,
          /* Вызывается, когда пользователь выбирает одну из подсказок */
          onSelect: showSuggestion
        });

        $("#company_ogrn").suggestions({
          token: token,
          type: "PARTY",
          count: 5,
          /* Вызывается, когда пользователь выбирает одну из подсказок */
          onSelect: showSuggestion
        });
        $("#name").suggestions({
          token: token,
          type: "NAME",
          /* Вызывается, когда пользователь выбирает одну из подсказок */
          onSelect: function (suggestion) {
            console.log(suggestion);
          }
        });
        $("#email").suggestions({
          token: token,
          type: "EMAIL",
          /* Вызывается, когда пользователь выбирает одну из подсказок */
          onSelect: function (suggestion) {
          }
        });
        $("#city").suggestions({
          // Замените на свой API-ключ
          token: token,
          type: "ADDRESS",
          hint: false,
          bounds: "city",
          constraints: {
            label: "",
            locations: { city_type_full: "город" }
          },
          onSelect: function (suggestion) {
            var data = suggestion.data;
            $('#open_account_step2 input[name=city_code]').val(data.city_kladr_id);
          }
        });

      }
    });
  }
  return false;
});

$(document).on("click", "#result #buttons_callback", function () {
  var mist = 0;
  var phone = $('#result input[name=phone]').val();
  var sessid = $('input[name=sessid]').val();
  if (phone != '') {
    $('#result input[name=phone]').parent().removeClass("error");
  } else {
    $('#result input[name=phone]').parent().addClass("error");
    mist = mist + 1;
  }

  if (mist == 0) {
    $.ajax({
      type: "POST",
      url: "/local/templates/main/include/pages/open_account/ajax/callback.php",
      data: ({
        "phone": phone,
        "sessid": sessid
      }),
      success: function (msg) {
        $('#result').html(msg);
        $('.popup_wrapper.rko').addClass('active');
      }
    });
  }
  return false;
});

$(document).on("click", "#open_account_step1_page #buttons_callback", function () {
  var mist = 0;
  var phone = $('#open_account_step1_page input[name=phone]').val();
  var sessid = $('input[name=sessid]').val();
  if (phone != '') {
    $('#open_account_step1_page input[name=phone]').parent().removeClass("error");
  } else {
    $('#open_account_step1_page input[name=phone]').parent().addClass("error");
    mist = mist + 1;
  }

  if (mist == 0) {
    $.ajax({
      type: "POST",
      url: "/local/templates/main/include/pages/open_account/ajax/callback.php",
      data: ({
        "phone": phone,
        "sessid": sessid
      }),
      success: function (msg) {
        $('#result').html(msg);
        $('.popup_wrapper.rko').addClass('active');
      }
    });
  }
  return false;
});

$(document).on("submit", "#open_account_step1", function () {
  var mist = 0;
  var phone = $('#open_account_step1 input[name=phone]').val();
  var sessid = $('input[name=sessid]').val();
  var tariff = $('#open_account_step1 input[name=tariff]').val();
  if (phone != '') {
    $('#open_account_step1 input[name=phone]').parent().removeClass("error");
  } else {
    $('#open_account_step1 input[name=phone]').parent().addClass("error");
    mist = mist + 1;
  }

  if (mist == 0) {
    $.ajax({
      type: "POST",
      url: "/local/templates/main/include/pages/open_account/ajax/status.php",
      data: ({
        "phone": phone,
        "tariff": tariff,
        "sessid": sessid
      }),
      success: function (msg) {
        $('#result').html(msg);

        $('#open_account_step2').parsley();
        $('.popup-block-form-input.email input').blur(function () {
          if ($(this).val().length !== 0) {
            $(this).addClass('filled');
          } else {
            $(this).removeClass('filled');
          }
        });
        $('#popup_phone').inputmask({
          mask: '+7 (999) 999-99-99',
          showMaskOnHover: false
        });
        $('#popup_phone').blur(function () {
          if ($(this).val().length !== 0) {
            $(this).addClass('filled');
          } else {
            $(this).removeClass('filled');
          }
        });
        $("#tariff").selectmenu();
        $("#discount").selectmenu();

        // Замените на свой API-ключ
        var token = "f7cd59d270fa2905f74cf38f74981c3abbe346c8";

        function join(arr /*, separator */) {
          var separator = arguments.length > 1 ? arguments[1] : ", ";
          return arr.filter(function (n) { return n }).join(separator);
        }

        function showSuggestion(suggestion) {
          $("label[for=company_name]").text("Название компании");
          $(".popup-block-form-input.company").show();

          var data = suggestion.data;
          if (!data)
            return;

          $("#company_name").val(join([data.name.full_with_opf]));
          $("#company_inn").val(join([data.inn]));
          $("#company_ogrn").val(join([data.ogrn]));
          if ($("#company_name").val !== 0) {
            $("#company_name").removeClass('parsley-error');
          }
          if ($("#company_inn").val !== 0) {
            $("#company_inn").removeClass('parsley-error');
          }
          if ($("#company_ogrn").val !== 0) {
            $("#company_ogrn").removeClass('parsley-error');
          }
        }

        $("#company_name").suggestions({
          token: token,
          type: "PARTY",
          count: 5,
          /* Вызывается, когда пользователь выбирает одну из подсказок */
          onSelect: showSuggestion
        });

        $("#company_inn").suggestions({
          token: token,
          type: "PARTY",
          count: 5,
          /* Вызывается, когда пользователь выбирает одну из подсказок */
          onSelect: showSuggestion
        });

        $("#company_ogrn").suggestions({
          token: token,
          type: "PARTY",
          count: 5,
          /* Вызывается, когда пользователь выбирает одну из подсказок */
          onSelect: showSuggestion
        });
        $("#name").suggestions({
          token: token,
          type: "NAME",
          /* Вызывается, когда пользователь выбирает одну из подсказок */
          onSelect: function (suggestion) {
            console.log(suggestion);
            var $_count = parseInt($.trim($(this).val()).split(' ').length); // Подсчет слов
            if ($_count > 2) {
              $(this).removeClass('parsley-error');
            } else {
              $(this).addClass('parsley-error');
            }
            $('#name').on('change keyup keydown', function () {
              var $_count = parseInt($.trim($(this).val()).split(' ').length); // Подсчет слов
              if ($_count > 2) {
                $(this).removeClass('parsley-error');
              } else {
                $(this).addClass('parsley-error');
              }
            });
          }
        });
        $("#email").suggestions({
          token: token,
          type: "EMAIL",
          /* Вызывается, когда пользователь выбирает одну из подсказок */
          onSelect: function (suggestion) {
            if ($("#email").val !== 0) {
              $(this).removeClass('parsley-error');
            } else {
              $(this).addClass('parsley-error');
            }
          }
        });
        $("#city").suggestions({
          // Замените на свой API-ключ
          token: token,
          type: "ADDRESS",
          hint: false,
          bounds: "city",
          constraints: {
            label: "",
            locations: { city_type_full: "город" }
          },
          onSelect: function (suggestion) {
            var data = suggestion.data;
            $('#open_account_step2 input[name=city_code]').val(data.city_kladr_id);
          }
        });

      }
    });
  }
  return false;
});

$(document).on("click", "#open_account_status .back", function () {
  $.ajax({
    type: "POST",
    url: "/local/templates/main/include/pages/open_account/ajax/step_1.php",
    success: function (msg) {
      $('#result').html(msg);
      $('#popup_phone').inputmask({
        mask: '+7 (999) 999-99-99',
        showMaskOnHover: false
      });
    }
  });
  return false;
});

$(document).on("click", "#open_account_status .list-unstyled a", function () {
  var mist = 0;
  var phone = $('#open_account_status input[name=phone]').val();
  var hash = $(this).parent().children('input[name=hash_next]').val();
  var sessid = $('input[name=sessid]').val();
  var tariff = $('#open_account_status input[name=tariff]').val();
  if (phone != '') {
    $('#open_account_status input[name=phone]').parent().removeClass("error");
  } else {
    $('#open_account_status input[name=phone]').parent().addClass("error");
    mist = mist + 1;
  }
  if (hash != '') {
    $('#open_account_status input[name=hash]').parent().removeClass("error");
  } else {
    $('#open_account_status input[name=hash]').parent().addClass("error");
    mist = mist + 1;
  }
  if (mist == 0) {
    $.ajax({
      type: "POST",
      url: "/local/templates/main/include/pages/open_account/ajax/form.php",
      data: ({
        "phone": phone,
        "hash": hash,
        "tariff": tariff,
        "sessid": sessid
      }),
      success: function (msg) {
        $('#result').html(msg);

        $('#open_account_step2').parsley();
        $('.popup-block-form-input.email input').blur(function () {
          if ($(this).val().length !== 0) {
            $(this).addClass('filled');
          } else {
            $(this).removeClass('filled');
          }
        });

        $('#popup_phone').inputmask({
          mask: '+7 (999) 999-99-99',
          showMaskOnHover: false
        });
        $("#tariff").selectmenu();
        $("#discount").selectmenu();

        // Замените на свой API-ключ
        var token = "f7cd59d270fa2905f74cf38f74981c3abbe346c8";

        function join(arr /*, separator */) {
          var separator = arguments.length > 1 ? arguments[1] : ", ";
          return arr.filter(function (n) { return n }).join(separator);
        }

        function showSuggestion(suggestion) {
          $("label[for=company_name]").text("Название компании");
          $(".popup-block-form-input.company").show();

          var data = suggestion.data;
          if (!data)
            return;

          $("#company_name").val(join([data.name.full_with_opf]));
          $("#company_inn").val(join([data.inn]));
          $("#company_ogrn").val(join([data.ogrn]));
          if ($("#company_name").val !== 0) {
            $("#company_name").removeClass('parsley-error');
          }
          if ($("#company_inn").val !== 0) {
            $("#company_inn").removeClass('parsley-error');
          }
          if ($("#company_ogrn").val !== 0) {
            $("#company_ogrn").removeClass('parsley-error');
          }
        }

        $("#company_name").suggestions({
          token: token,
          type: "PARTY",
          count: 5,
          /* Вызывается, когда пользователь выбирает одну из подсказок */
          onSelect: showSuggestion
        });

        $("#company_inn").suggestions({
          token: token,
          type: "PARTY",
          count: 5,
          /* Вызывается, когда пользователь выбирает одну из подсказок */
          onSelect: showSuggestion
        });

        $("#company_ogrn").suggestions({
          token: token,
          type: "PARTY",
          count: 5,
          /* Вызывается, когда пользователь выбирает одну из подсказок */
          onSelect: showSuggestion
        });
        $("#name").suggestions({
          token: token,
          type: "NAME",
          /* Вызывается, когда пользователь выбирает одну из подсказок */
          onSelect: function (suggestion) {
            console.log(suggestion);
            var $_count = parseInt($.trim($(this).val()).split(' ').length); // Подсчет слов
            if ($_count > 2) {
              $(this).removeClass('parsley-error');
            } else {
              $(this).addClass('parsley-error');
            }
            $('#name').on('change keyup keydown', function () {
              var $_count = parseInt($.trim($(this).val()).split(' ').length); // Подсчет слов
              if ($_count > 2) {
                $(this).removeClass('parsley-error');
              } else {
                $(this).addClass('parsley-error');
              }
            });
          }
        });
        $("#email").suggestions({
          token: token,
          type: "EMAIL",
          /* Вызывается, когда пользователь выбирает одну из подсказок */
          onSelect: function (suggestion) {
            if ($("#email").val !== 0) {
              $(this).removeClass('parsley-error');
            } else {
              $(this).addClass('parsley-error');
            }
          }
        });
        $("#city").suggestions({
          // Замените на свой API-ключ
          token: token,
          type: "ADDRESS",
          hint: false,
          bounds: "city",
          constraints: {
            label: "",
            locations: { city_type_full: "город" }
          },
          onSelect: function (suggestion) {
            var data = suggestion.data;
            $('#open_account_step2 input[name=city_code]').val(data.city_kladr_id);
          }
        });
      }
    });
  }
  return false;
});

$(document).on("click", "#open_account_status .open", function () {
  var mist = 0;
  var phone = $('#open_account_status input[name=phone]').val();
  var hash = $('#open_account_status input[name=hash]').val();
  var sessid = $('input[name=sessid]').val();
  var tariff = $('#open_account_status input[name=tariff]').val();
  if (phone != '') {
    $('#open_account_status input[name=phone]').parent().removeClass("error");
  } else {
    $('#open_account_status input[name=phone]').parent().addClass("error");
    mist = mist + 1;
  }
  if (hash != '') {
    $('#open_account_status input[name=hash]').parent().removeClass("error");
  } else {
    $('#open_account_status input[name=hash]').parent().addClass("error");
    mist = mist + 1;
  }
  if (mist == 0) {
    $.ajax({
      type: "POST",
      url: "/local/templates/main/include/pages/open_account/ajax/form.php",
      data: ({
        "phone": phone,
        "hash": hash,
        "tariff": tariff,
        "sessid": sessid
      }),
      success: function (msg) {
        $('#result').html(msg);

        $('#open_account_step2').parsley();
        $('.popup-block-form-input.email input').blur(function () {
          if ($(this).val().length !== 0) {
            $(this).addClass('filled');
          } else {
            $(this).removeClass('filled');
          }
        });
        $('#popup_phone').inputmask({
          mask: '+7 (999) 999-99-99',
          showMaskOnHover: false
        });
        $("#tariff").selectmenu();
        $("#discount").selectmenu();

        // Замените на свой API-ключ
        var token = "f7cd59d270fa2905f74cf38f74981c3abbe346c8";

        function join(arr /*, separator */) {
          var separator = arguments.length > 1 ? arguments[1] : ", ";
          return arr.filter(function (n) { return n }).join(separator);
        }

        function showSuggestion(suggestion) {
          $("label[for=company_name]").text("Название компании");
          $(".popup-block-form-input.company").show();

          var data = suggestion.data;
          if (!data)
            return;

          $("#company_name").val(join([data.name.full_with_opf]));
          $("#company_inn").val(join([data.inn]));
          $("#company_ogrn").val(join([data.ogrn]));
          if ($("#company_name").val !== 0) {
            $("#company_name").removeClass('parsley-error');
          }
          if ($("#company_inn").val !== 0) {
            $("#company_inn").removeClass('parsley-error');
          }
          if ($("#company_ogrn").val !== 0) {
            $("#company_ogrn").removeClass('parsley-error');
          }
        }

        $("#company_name").suggestions({
          token: token,
          type: "PARTY",
          count: 5,
          /* Вызывается, когда пользователь выбирает одну из подсказок */
          onSelect: showSuggestion
        });

        $("#company_inn").suggestions({
          token: token,
          type: "PARTY",
          count: 5,
          /* Вызывается, когда пользователь выбирает одну из подсказок */
          onSelect: showSuggestion
        });

        $("#company_ogrn").suggestions({
          token: token,
          type: "PARTY",
          count: 5,
          /* Вызывается, когда пользователь выбирает одну из подсказок */
          onSelect: showSuggestion
        });
        $("#name").suggestions({
          token: token,
          type: "NAME",
          /* Вызывается, когда пользователь выбирает одну из подсказок */
          onSelect: function (suggestion) {
            console.log(suggestion);
            var $_count = parseInt($.trim($(this).val()).split(' ').length); // Подсчет слов
            if ($_count > 2) {
              $(this).removeClass('parsley-error');
            } else {
              $(this).addClass('parsley-error');
            }
            $('#name').on('change keyup keydown', function () {
              var $_count = parseInt($.trim($(this).val()).split(' ').length); // Подсчет слов
              if ($_count > 2) {
                $(this).removeClass('parsley-error');
              } else {
                $(this).addClass('parsley-error');
              }
            });
          }
        });
        $("#email").suggestions({
          token: token,
          type: "EMAIL",
          /* Вызывается, когда пользователь выбирает одну из подсказок */
          onSelect: function (suggestion) {
            if ($("#email").val !== 0) {
              $(this).removeClass('parsley-error');
            } else {
              $(this).addClass('parsley-error');
            }
          }
        });
        $("#city").suggestions({
          // Замените на свой API-ключ
          token: token,
          type: "ADDRESS",
          hint: false,
          bounds: "city",
          constraints: {
            label: "",
            locations: { city_type_full: "город" }
          },
          onSelect: function (suggestion) {
            var data = suggestion.data;
            $('#open_account_step2 input[name=city_code]').val(data.city_kladr_id);
          }
        });
      }
    });
  }
  return false;
});

$(document).on("click", "#open_account_step2 .popup-block-form-input-geo", function () {
  $(this).addClass('active');
  $.ajax({
    type: "POST",
    url: "/local/templates/main/include/pages/open_account/ajax/geo_local.php",
    success: function (msg) {
      const array = JSON.parse(msg);
      $('#open_account_step2 input[name=city]').val(array.name);
      $('#open_account_step2 input[name=city_code]').val(array.code);
      $('#open_account_step2 .popup-block-form-input-geo').removeClass('active');
      if ($("#city").val !== 0) {
        $('#city').removeClass('parsley-error');
      }
    }
  });
  return false;
});

$(document).on("click", "#open_account_sms .popup-block-form-buttons-submit a", function () {
  $(this).submit();
  return false;
});

$(document).on("submit", "#open_account_sms", function () {
  var mist = 0;
  var sms_code = $('#open_account_sms input[name=sms_code]').val();
  var sessid = $('input[name=sessid]').val();
  var hash = $('#open_account_sms input[name=hash]').val();
  if (sms_code == '') {
    $('#sms_result').text('Код из СМС');
    $('#sms_code').addClass('error');
  } else {
    $.ajax({
      type: "POST",
      url: "/local/templates/main/include/pages/open_account/ajax/valid_sms.php",
      data: ({
        "sms_code": sms_code,
        "sessid": sessid,
        "hash": hash
      }),
      success: function (msg) {
        const array = JSON.parse(msg);
        if (array == 'ok') {
          thank_account();
          $('#sms_code').removeClass('error');
        } else {
          $('#sms_result').html(array);
          $('#sms_code').addClass('error');
        }
      }
    });
  }
  return false;
});

$(document).on('click', '#discount-menu', function () {
  var discount = $('select[name=discount]').val();
  var tariff = $('select[name=tariff]').val();

  $('.popup-block-tariff-item-subitem-line').removeClass('active');
  $('#price_' + tariff + '_' + discount).addClass('active');

  $('.popup-block-tariff-item-subitem-line').hide();
  $('#price_' + tariff + '_' + discount).show();

  if (discount > 0) {
    $('.popup-block-tariff-item.active .popup-block-tariff-item-subitem-line-value.old').show();
  } else {
    $('.popup-block-tariff-item.active .popup-block-tariff-item-subitem-line-value.old').hide();
  }
  return false;
});

$(document).on('click', '#tariff-menu', function () {
  var discount = $('select[name=discount]').val();
  var tariff = $('select[name=tariff]').val();

  $('.popup-block-tariff-item-subitem-line').removeClass('active');
  $('#price_' + tariff + '_' + discount).addClass('active');

  $('.popup-block-tariff-item-subitem-line').hide();
  $('#price_' + tariff + '_' + discount).show();

  if (discount > 0) {
    $('.popup-block-tariff-item.active .popup-block-tariff-item-subitem-line-value.old').show();
  } else {
    $('.popup-block-tariff-item.active .popup-block-tariff-item-subitem-line-value.old').hide();
  }

  $('.popup-block-tariff-item').removeClass('active');
  $('#tariff_' + tariff).addClass('active');
  return false;
});

function startTimer() {
  var time = $('#my_timer').html();
  var arr = time.split(":");
  var m = arr[0];
  var s = arr[1];
  if (s == 0) {
    if (m == 0) {
      $('#my_timer').parent('div').html('<span class="repeat-sms">Получить смс-код повторно</span>');
      return;
      m = 60;
    }
    m--;
    if (m < 10) m = "0" + m;
    s = 59;
  }
  else s--;
  if (s < 10) s = "0" + s;
  $('#my_timer').html(m + ":" + s);
  setTimeout(startTimer, 1000);
}

$(document).on("submit", "#open_account_step2", function () {
  var mist = 0;
  var mist = 0;
  var phone = $('#open_account_step2 input[name=phone]').val();
  var sessid = $('input[name=sessid]').val();
  var hash = $('#open_account_step2 input[name=hash]').val();
  var fio = $('#open_account_step2 input[name=fio]').val();
  var email = $('#open_account_step2 input[name=email]').val();
  var organization_name = $('#open_account_step2 input[name=organization_name]').val();
  var city = $('#open_account_step2 input[name=city]').val();
  var discount = $('#open_account_step2 select[name=discount]').val();
  var tariff = $('#open_account_step2 select[name=tariff]').val();
  var city_code = $('#open_account_step2 input[name=city_code]').val();
  var organization_registration_number = $('#open_account_step2 input[name=organization_registration_number]').val();
  var organization_taxpayer_number = $('#open_account_step2 input[name=organization_taxpayer_number]').val();
  if (phone != '') {
    $('#open_account_step2 input[name=phone]').parent().removeClass("error");
  } else {
    $('#open_account_step2 input[name=phone]').parent().addClass("error");
    mist = mist + 1;
  }
  if (fio != '') {
    $('#open_account_step2 input[name=fio]').parent().removeClass("error");
  } else {
    $('#open_account_step2 input[name=fio]').parent().addClass("error");
    mist = mist + 1;
  }
  if (email != '') {
    $('#open_account_step2 input[name=email]').parent().removeClass("error");
  } else {
    $('#open_account_step2 input[name=email]').parent().addClass("error");
    mist = mist + 1;
  }
  if (organization_name != '') {
    $('#open_account_step2 input[name=organization_name]').parent().removeClass("error");
  } else {
    $('#open_account_step2 input[name=organization_name]').parent().addClass("error");
    mist = mist + 1;
  }
  if (city_code != '') {
    $('#open_account_step2 input[name=city_code]').parent().removeClass("error");
  } else {
    $('#open_account_step2 input[name=city_code]').parent().addClass("error");
    mist = mist + 1;
  }
  if (organization_registration_number != '') {
    $('#open_account_step2 input[name=organization_registration_number]').parent().removeClass("error");
  } else {
    $('#open_account_step2 input[name=organization_registration_number]').parent().addClass("error");
    mist = mist + 1;
  }
  if (organization_taxpayer_number != '') {
    $('#open_account_step2 input[name=organization_taxpayer_number]').parent().removeClass("error");
  } else {
    $('#open_account_step2 input[name=organization_taxpayer_number]').parent().addClass("error");
    mist = mist + 1;
  }
  if (mist == 0) {
    $.ajax({
      type: "POST",
      url: "/local/templates/main/include/pages/open_account/ajax/sms.php",
      data: ({
        "phone": phone,
        "hash": hash,
        "fio": fio,
        "email": email,
        "organization_name": organization_name,
        "city_code": city_code,
        "city": city,
        "discount": discount,
        "tariff": tariff,
        "organization_registration_number": organization_registration_number,
        "organization_taxpayer_number": organization_taxpayer_number,
        "sessid": sessid
      }),
      success: function (msg) {
        test = msg.split('<');
alert(test);
        const array = JSON.parse(msg);
        alert(array.email);
        if(array.email){
          $('#open_account_step2 input[name=email]').addClass("parsley-error");
        }else{
          $('#open_account_step2 input[name=email]').removeClass("parsley-error");
          $('#result').html(msg);
          $('#sms_code').inputmask({
            mask: '9999',
            showMaskOnHover: false
          });
          startTimer();
        }

      }
    });
  }
  return false;
});

$(document).on("click", "#open_account_sms .popup-block-form-back a", function () {
  var mist = 0;
  var phone = $('#open_account_sms input[name=phone]').val();
  var sessid = $('input[name=sessid]').val();
  var hash = $('#open_account_sms input[name=hash]').val();
  var fio = $('#open_account_sms input[name=fio]').val();
  var email = $('#open_account_sms input[name=email]').val();
  var organization_name = $('#open_account_sms input[name=organization_name]').val();
  var city_code = $('#open_account_sms input[name=city_code]').val();
  var city = $('#open_account_sms input[name=city]').val();
  var discount = $('#open_account_sms input[name=discount]').val();
  var tariff = $('#open_account_sms input[name=tariff]').val();
  var organization_registration_number = $('#open_account_sms input[name=organization_registration_number]').val();
  var organization_taxpayer_number = $('#open_account_sms input[name=organization_taxpayer_number]').val();

  $.ajax({
    type: "POST",
    url: "/local/templates/main/include/pages/open_account/ajax/form.php",
    data: ({
      "phone": phone,
      "hash": hash,
      "fio": fio,
      "email": email,
      "organization_name": organization_name,
      "city_code": city_code,
      "city": city,
      "discount": discount,
      "tariff": tariff,
      "organization_registration_number": organization_registration_number,
      "organization_taxpayer_number": organization_taxpayer_number,
      "sessid": sessid
    }),
    success: function (msg) {
      $('#result').html(msg);
      $('#popup_phone').inputmask({
        mask: '+7 (999) 999-99-99',
        showMaskOnHover: false
      });
      $("#tariff").selectmenu();
      $("#discount").selectmenu();

      // Замените на свой API-ключ
      var token = "f7cd59d270fa2905f74cf38f74981c3abbe346c8";

      function join(arr /*, separator */) {
        var separator = arguments.length > 1 ? arguments[1] : ", ";
        return arr.filter(function (n) { return n }).join(separator);
      }

      function showSuggestion(suggestion) {
        $("label[for=company_name]").text("Название компании");
        $(".popup-block-form-input.company").show();

        var data = suggestion.data;
        if (!data)
          return;

        $("#company_name").val(join([data.name.full_with_opf]));
        $("#company_inn").val(join([data.inn]));
        $("#company_ogrn").val(join([data.ogrn]));
      }

      $("#company_name").suggestions({
        token: token,
        type: "PARTY",
        count: 5,
        /* Вызывается, когда пользователь выбирает одну из подсказок */
        onSelect: showSuggestion
      });

      $("#company_inn").suggestions({
        token: token,
        type: "PARTY",
        count: 5,
        /* Вызывается, когда пользователь выбирает одну из подсказок */
        onSelect: showSuggestion
      });

      $("#company_ogrn").suggestions({
        token: token,
        type: "PARTY",
        count: 5,
        /* Вызывается, когда пользователь выбирает одну из подсказок */
        onSelect: showSuggestion
      });
      $("#name").suggestions({
        token: token,
        type: "NAME",
        /* Вызывается, когда пользователь выбирает одну из подсказок */
        onSelect: function (suggestion) {
          console.log(suggestion);
        }
      });
      $("#email").suggestions({
        token: token,
        type: "EMAIL",
        /* Вызывается, когда пользователь выбирает одну из подсказок */
        onSelect: function (suggestion) {
        }
      });
      $("#city").suggestions({
        // Замените на свой API-ключ
        token: token,
        type: "ADDRESS",
        hint: false,
        bounds: "city",
        constraints: {
          label: "",
          locations: { city_type_full: "город" }
        },
        onSelect: function (suggestion) {
          var data = suggestion.data;
          $('#open_account_step2 input[name=city_code]').val(data.city_kladr_id);
        }
      });
    }
  });
  return false;
});

$(document).on("click", "#open_account_sms .repeat-sms", function () {
  var sessid = $('input[name=sessid]').val();
  var hash = $('#open_account_sms input[name=hash]').val();
  $.ajax({
    type: "POST",
    url: "/local/templates/main/include/pages/open_account/ajax/repeat_sms.php",
    data: ({
      "hash": hash,
      "sessid": sessid
    }),
    success: function (msg) {
      $('.repeat-sms').parent('div').html('Получить код повторно <br> можно будет через <span id="my_timer">1:35</span>');
      startTimer();
    }
  });

  return false;
});


$(document).ready(function () {
  var nav_last = 0;
  $( ".nav_last" ).each(function() {
      nav_last++; 
      if(nav_last>1){
          $(this).remove();
      } else{
          $(this).show();
      }
      console.log(1);
  });
});