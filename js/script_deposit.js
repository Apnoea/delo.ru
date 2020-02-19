$(document).ready(function () {
  if ($('.deposit-page').length > 0) {
    function num2str(n, text_forms) {
      n = Math.abs(n) % 100; var n1 = n % 10;
      if (n > 10 && n < 20) { return text_forms[2]; }
      if (n1 > 1 && n1 < 5) { return text_forms[1]; }
      if (n1 == 1) { return text_forms[0]; }
      return text_forms[2];
    }
    function calc(summa, srok) {
      var obj = [];
      $("#secret_input input").each(function () {
        obj[$(this).attr("name")] = {
          min: $(this).attr("max"),
          max: $(this).attr("min"),
          percent: $(this).attr("percent"),
          day: $(this).attr("day")
        };
      });
      for (key in obj) {
        if (summa <= parseInt(obj[key].min) && summa >= parseInt(obj[key].max)) {
          if (srok <= parseInt(obj[key].day)) {
            //console.log("asd1", obj[key].percent);
            result_function = obj[key].percent;
            //console.log(result_function);
            return result_function;
          }
        }
      }
    }
    $(function () {
      $("#deposit_sum").slider({
        range: "min",
        value: 50000,
        min: 10000,
        max: 100000000,
        slide: function (event, ui) {
          $("#amount_sum").val(ui.value.toLocaleString('ru') + ' ₽');
        }
      });
      $("#amount_sum").val($("#deposit_sum").slider("value").toLocaleString('ru') + ' ₽');

      $("#deposit_date").slider({
        range: "min",
        value: 4,
        min: 1,
        max: 12,
        slide: function (event, ui) {
          $("#amount_date").val(ui.value);
        }
      });

      $("#amount_sum").keypress(function (e) {
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
          return false;
        }
      });
      $("#amount_date").keypress(function (e) {
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
          return false;
        }
      });

      /*При загрузке страницы*/
      $("#amount_date").val($("#deposit_date").slider("value"));
      summa = Number($("#amount_sum").val().replace(/\s+/g, '').replace('₽', ''));
      srok = Number($("#amount_date").val()) * 30;
      res = Number(calc(summa, srok));
      result = Number(Math.round(summa + summa * res * srok / 365 / 100));
      percent_html = String(res).replace('.', ',');
      $('#result_percent').html(percent_html + "%");
      $('#result_summ').html(result.toLocaleString() + " ₽");

      /*При изменении суммы*/
      $('#deposit_sum').on("slidechange", function () {
        summa = Number($("#amount_sum").val().replace(/\s+/g, '').replace('₽', ''));
        if ($("#select_date-button .ui-selectmenu-text").html() == "месяцы") {
          srok = Number($("#amount_date").val()) * 30;
        } else {
          srok = Number($("#amount_date").val());
        }
        res = Number(calc(summa, srok));
        result = Number(Math.round(summa + summa * res * srok / 365 / 100));
        percent_html = String(res).replace('.', ',');
        $('#result_percent').html(percent_html + "%");
        $('#result_summ').html(result.toLocaleString() + " ₽");
      });

      function sumChange() {
        if (Number($("#amount_sum").val().replace(/\s+/g, '').replace('₽', '')) < 10000) {
          summa = 10000;
          $("#amount_sum").val(summa);
        } else if (Number($("#amount_sum").val().replace(/\s+/g, '').replace('₽', '')) > 100000000) {
          summa = 100000000;
          $("#amount_sum").val(summa);
        } else {
          summa = Number($("#amount_sum").val().replace(/\s+/g, '').replace('₽', ''));
        }
        if ($("#select_date-button .ui-selectmenu-text").html() == "месяцы") {
          srok = Number($("#amount_date").val()) * 30;
        } else {
          srok = Number($("#amount_date").val());
        }
        res = Number(calc(summa, srok));
        result = Number(Math.round(summa + summa * res * srok / 365 / 100));
        percent_html = String(res).replace('.', ',');
        $("#deposit_sum").slider('value', summa);
        $('#amount_sum').val($("#deposit_sum").slider("value").toLocaleString('ru') + ' ₽');
        $('#result_percent').html(percent_html + "%");
        $('#result_summ').html(result.toLocaleString() + " ₽");
      }

      /*При изменении инпута суммы*/

      $('#amount_sum').focusout('input', function () {
        sumChange()
      });

      /*При нажатии энтер инпута суммы*/
      $('#amount_sum').keydown(function (e) {
        if (e.keyCode === 13) {
          sumChange()
        }
      });

      function dateChange() {
        summa = Number($("#amount_sum").val().replace(/\s+/g, '').replace('₽', ''));
        if ($("#select_date-button .ui-selectmenu-text").html() == "месяцы") {
          if (Number($("#amount_date").val()) * 30 < 1) {
            srok = 1 * 30;
            $("#amount_date").val(srok / 30);
          } else if (Number($("#amount_date").val()) * 30 > 365) {
            srok = 12 * 30;
            $("#amount_date").val(srok / 30);
          } else {
            srok = Number($("#amount_date").val()) * 30;
            $("#amount_date").val(srok / 30);
          }
          $("#deposit_date").slider('value', srok / 30);
        } else {
          if (Number($("#amount_date").val()) < 1) {
            srok = 1;
          } else if (Number($("#amount_date").val()) > 365) {
            srok = 365;
          } else {
            srok = Number($("#amount_date").val());
          }
          $("#amount_date").val(srok);
          $("#deposit_date").slider('value', srok);
        }
        res = Number(calc(summa, srok));
        result = Number(Math.round(summa + summa * res * srok / 365 / 100));
        percent_html = String(res).replace('.', ',');
        $('#result_percent').html(percent_html + "%");
        $('#result_summ').html(result.toLocaleString() + " ₽");
        if ($("#select_date-button .ui-selectmenu-text").html() == "месяцы") {
          $('#srok_text').html('Сумма за ' + $("#amount_date").val() + ' ' + num2str($("#amount_date").val(), ['месяц', 'месяца', 'месяцев']));
        } else {
          $('#srok_text').html('Сумма за ' + $("#amount_date").val() + ' ' + num2str($("#amount_date").val(), ['день', 'дня', 'дней']));
        }
      }

      /*При изменении инпута срока*/
      $('#amount_date').focusout('input', function () {
        dateChange()
      });

      /*При нажатии энтер инпута срока*/
      $('#amount_date').keydown(function (e) {
        if (e.keyCode === 13) {
          dateChange()
        }
      });

      /*При изменении срока*/
      $('#deposit_date').on("slidechange", function () {
        summa = Number($("#amount_sum").val().replace(/\s+/g, '').replace('₽', ''));
        if ($("#select_date-button .ui-selectmenu-text").html() == "месяцы") {
          srok = Number($("#amount_date").val()) * 30;
        } else {
          srok = Number($("#amount_date").val());
        }
        res = Number(calc(summa, srok));
        result = Number(Math.round(summa + summa * res * srok / 365 / 100));
        percent_html = String(res).replace('.', ',');
        $('#result_percent').html(percent_html + "%");
        $('#result_summ').html(result.toLocaleString() + " ₽");

        if ($("#select_date-button .ui-selectmenu-text").html() == "месяцы") {
          $('#srok_text').html('Сумма за ' + $("#amount_date").val() + ' ' + num2str($("#amount_date").val(), ['месяц', 'месяца', 'месяцев']));
        } else {
          $('#srok_text').html('Сумма за ' + $("#amount_date").val() + ' ' + num2str($("#amount_date").val(), ['день', 'дня', 'дней']));
        }
      });

      $("#select_date").selectmenu({
        change: function () {
          if ($("#select_date-button .ui-selectmenu-text").html() == "месяцы") {
            srok_slider = Math.round(Number($("#amount_date").val()) / 30);
            $("#amount_date").val(srok_slider);
            $("#deposit_date").slider({
              range: "min",
              value: srok_slider,
              min: 1,
              max: 12,
              slide: function (event, ui) {
                $("#amount_date").val(ui.value);
              }
            });
            summa = Number($("#amount_sum").val().replace(/\s+/g, '').replace('₽', ''));
            res = Number(calc(summa, srok));
            result = Number(Math.round(summa + summa * res * srok_slider / 365 / 100));
            percent_html = String(res).replace('.', ',');
            $('#result_percent').html(percent_html + "%");
            $('#result_summ').html(result.toLocaleString() + " ₽");
            $('#srok_text').html('Сумма за ' + $("#amount_date").val() + ' ' + num2str($("#amount_date").val(), ['месяц', 'месяца', 'месяцев']));
          } else {
            srok_slider = Math.round(Number($("#amount_date").val()) * 30);
            $("#amount_date").val(srok_slider);
            $("#deposit_date").slider({
              range: "min",
              value: srok_slider,
              min: 1,
              max: 365,
              slide: function (event, ui) {
                $("#amount_date").val(ui.value);
              }
            });
            summa = Number($("#amount_sum").val().replace(/\s+/g, '').replace('₽', ''));
            res = Number(calc(summa, $("#amount_date").val()));
            result = Number(Math.round(summa + summa * res * $("#amount_date").val() / 365 / 100));
            console.log(result);
            percent_html = String(res).replace('.', ',');
            $('#result_percent').html(percent_html + "%");
            $('#result_summ').html(result.toLocaleString() + " ₽");
            $('#srok_text').html('Сумма за ' + $("#amount_date").val() + ' ' + num2str($("#amount_date").val(), ['день', 'дня', 'дней']));
          }
        }
      });
    });
  }
})
