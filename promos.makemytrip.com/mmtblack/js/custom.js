/*price Trikker*/
(function ($) {
  $.fn.animateNumbers = function (stop, commas, duration, ease) {
    return this.each(function () {
      var $this = $(this);
      var isInput = $this.is("input");
      var start = parseInt(
        isInput
          ? $this.val().replace(/,/g, "")
          : $this.text().replace(/,/g, ""),
      );
      var regex = /(\d)(?=(\d\d\d)+(?!\d))/g;
      commas = commas === undefined ? true : commas;

      // number inputs can't have commas or it blanks out
      if (isInput && $this[0].type === "number") {
        commas = false;
      }

      $({ value: start }).animate(
        { value: stop },
        {
          duration: duration === undefined ? 1000 : duration,
          easing: ease === undefined ? "swing" : ease,
          step: function () {
            isInput
              ? $this.val(Math.floor(this.value))
              : $this.text(Math.floor(this.value));
            if (commas) {
              isInput
                ? $this.val($this.val().replace(regex, "$1,"))
                : $this.text($this.text().replace(regex, "$1,"));
            }
          },
          complete: function () {
            if (
              parseInt($this.text()) !== stop ||
              parseInt($this.val()) !== stop
            ) {
              isInput ? $this.val(stop) : $this.text(stop);
              if (commas) {
                isInput
                  ? $this.val($this.val().replace(regex, "$1,"))
                  : $this.text($this.text().replace(regex, "$1,"));
              }
            }
          },
        },
      );
    });
  };
})(jQuery);
/*//price Trikker*/

$(function () {
  //slider initialization
  if ($(".claim-voucher-carousel").length > 0) {
    $(".claim-voucher-carousel").owlCarousel({
      margin: 10,
      nav: true,
      navText: [
        "<span class='nav_prev'><span></span></span>",
        "<span class='nav_next'><span></span></span>",
      ],
      autoWidth: true,
      /*stagePadding:2,
			loop:true, */
      autoHeight: true,
    });
  }
  //Successfull message at ready
  var successfullmsg;
  if ($(".mmt-alert-msg").hasClass("mmt-alert-msg--successfull")) {
    var $target_msg = $(".mmt-alert-msg--successfull");
    $target_msg.addClass("alert-animate");
    clearTimeout(successfullmsg);
    successfullmsg = setTimeout(function () {
      $(".mmt-alert-msg .cross_icon").click();
    }, 4000);
  }
  //Successfull message at ready

  //Related question's accordian
  $(".rel_ques_ac_header").on("click", function () {
    var $this = $(this);
    var $allRel_quesData = $(".rel_ques_ac_data:visible").not(
      $this.next(".rel_ques_ac_data"),
    );
    $this.toggleClass("active");
    $allRel_quesData.slideUp();
    $allRel_quesData.prev(".rel_ques_ac_header").removeClass("active");
    $this.next(".rel_ques_ac_data").slideToggle();
  });

  //Tabs
  $(".main_tabs > li.tabsnav__item").on("click", function () {
    var $li = $(this);
    var $li_a = $li.find("a");
    var $custom_data_tab = $li_a.attr("data-tab");
    var $other_data_tab = $li_a.parent("li").siblings("li").find("a");

    $li.siblings("li").not($li_a).children("a").removeClass("active");
    $li_a.addClass("active");

    for (var i = 0; i < parseInt($other_data_tab.length); i++) {
      var $getAttr = $($other_data_tab[i]).attr("data-tab");
      $("#" + $getAttr)
        .stop(false, true)
        .hide();
    }

    $("#" + $custom_data_tab)
      .stop(false, true)
      .fadeIn(600);
  });

  // Know about program - (Register page)
  $(".know_about_program").on("click", function () {
    var $this = $(this);
    var $getSpan_state = $this.find("span.know_state");
    var $getStateText = $getSpan_state.text();
    $(".know_morepoint_section").slideToggle();

    if ($getStateText == "+") $getSpan_state.html("&ndash;");
    else $getSpan_state.text("+");
  });

  // Voucher message copied and closed
  $(".voucher_copied_msg .cross_icon").on("click", function () {
    Callback_Animation_end("voucher_copied_msg", "slideOutUp", "slideInDown");
    clearInterval(msgInterval);
  });
  //alert message close
  $(".mmt-alert-msg .cross_icon").on("click", function () {
    $(".mmt-alert-msg").removeClass("alert-animate");
  });

  // Increase Voucher's quantity.
  $(".increase_vcount").on("click", function () {
    var $this = $(this);
    voucher_Calculations($this);
  });

  $(".decrease_vcount").on("click", function () {
    var $this = $(this);
    voucher_Calculations($this);
  });
}); //end of domReady()

$(window).on("load", function () {
  if ($(".trvl_expand_1").length > 0 || $(".trvl_fill2").length > 0) {
    $(".trvl_fill1").addClass("trvl_completed_fill");
    $(".trvl_fill2").addClass("trvl_pending_fill");

    // timeline check
    var $getCompleted_width = $(".trvl_expand_1").css("width");
    $getCompleted_width = $getCompleted_width.split("px")[0];
    var $getModulo = Math.floor($getCompleted_width / 165);
    for (i = 0; i < $getModulo; i++)
      $(".timeline_dots:eq(" + i + ")")
        .find("span")
        .addClass("active");

    $(".you_here").animate(
      { "margin-left": $getCompleted_width },
      1000,
      function () {},
    );
  }
});

// Voucher copy code to clipboard
if (document.getElementsByClassName("bms_btn").length > 0) {
  var btns = document.getElementsByClassName("bms_btn");
  var msgInterval = null;
  var clipboard = new Clipboard(btns);

  clipboard.on("success", function (e) {
    var $target_msg = $(".voucher_copied_msg");
    $target_msg
      .removeClass("slideOutUp")
      .addClass("animated slideInDown")
      .show();
    clearInterval(msgInterval);
    msgInterval = window.setTimeout(function () {
      $(".voucher_copied_msg .cross_icon").click();
    }, 4000);
    $target_msg.find("#copied_vc_code").text(e.text);
  });
}

//alert success and failed
var setalertmsg;
$(".mmt_alert_btn").on("click", function () {
  var $target_msg = $(".mmt-alert-msg");
  $target_msg.addClass("alert-animate");
  clearTimeout(setalertmsg);
  setalertmsg = setTimeout(function () {
    $(".mmt-alert-msg .cross_icon").click();
  }, 4000);

  //msgInterval = window.setTimeout(function(){ $(".mmt-alert-msg .cross_icon").click(); }, 4000);
});

// Animation callback end..
function Callback_Animation_end(element, addclass, removeclass) {
  $("." + element)
    .removeClass(removeclass)
    .addClass(addclass)
    .on(
      "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",
      function () {
        if ($(this).hasClass(addclass)) $(this).hide();
      },
    );
}

//Calculate Quantity
var voucher_Calculations = function ($this) {
  if ($this.parents(".voucher_media_body").find(".voucher_worth").length > 0) {
    var getVoucherWorth = parseInt(
      $this.parents(".voucher_media_body").find(".voucher_worth").text(),
    );
    var vcountVal = $this.parent(".vcount_wrap").find(".vcount_values");
    var maxCount = parseInt(vcountVal.attr("maxcount"));
    var currentVal = parseInt(vcountVal.text());
    calculateVoucherQuantity($this, getVoucherWorth, currentVal, maxCount);
  }
};

var calculateVoucherQuantity = function (
  thisObj,
  voucherWorth,
  currentVal,
  maxCount,
) {
  if (thisObj.hasClass("increase_vcount")) {
    if (currentVal < maxCount) {
      currentVal++;
      thisObj.prev(".vcount_values").text(currentVal);
      if (currentVal == maxCount) {
        thisObj.parents(".mtr_selct_main").addClass("increase_disabled");
      }
      thisObj.parents(".mtr_selct_main").removeClass("decrease_disabled");
    }
  } else if (thisObj.hasClass("decrease_vcount")) {
    if (currentVal > 0) {
      currentVal--;
      thisObj.next(".vcount_values").text(currentVal);
      if (currentVal == 0) {
        thisObj.parents(".mtr_selct_main").addClass("decrease_disabled");
      }
      thisObj.parents(".mtr_selct_main").removeClass("increase_disabled");
    }
  }

  // Update Voucher price
  updateVoucherPrice(voucherWorth, currentVal, maxCount);
};

var updateVoucherPrice = function (voucherWorth, currentVal, maxCount) {
  //$(".buy_voucher_right .buy_voucher_price").text(voucherWorth * currentVal);
  var getNumber = parseInt(voucherWorth * currentVal);
  $(".buy_voucher_price").animateNumbers(getNumber, false, 500);
};

//
