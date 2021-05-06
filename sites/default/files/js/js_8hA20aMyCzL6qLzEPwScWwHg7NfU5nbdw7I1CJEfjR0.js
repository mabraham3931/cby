/*!
 * hoverIntent r7 // 2013.03.11 // jQuery 1.9.1+
 * http://cherne.net/brian/resources/jquery.hoverIntent.html
 *
 * You may use hoverIntent under the terms of the MIT license.
 * Copyright 2007, 2013 Brian Cherne
 */
(function(e){e.fn.hoverIntent=function(t,n,r){var i={interval:100,sensitivity:7,timeout:0};if(typeof t==="object"){i=e.extend(i,t)}else if(e.isFunction(n)){i=e.extend(i,{over:t,out:n,selector:r})}else{i=e.extend(i,{over:t,out:t,selector:n})}var s,o,u,a;var f=function(e){s=e.pageX;o=e.pageY};var l=function(t,n){n.hoverIntent_t=clearTimeout(n.hoverIntent_t);if(Math.abs(u-s)+Math.abs(a-o)<i.sensitivity){e(n).off("mousemove.hoverIntent",f);n.hoverIntent_s=1;return i.over.apply(n,[t])}else{u=s;a=o;n.hoverIntent_t=setTimeout(function(){l(t,n)},i.interval)}};var c=function(e,t){t.hoverIntent_t=clearTimeout(t.hoverIntent_t);t.hoverIntent_s=0;return i.out.apply(t,[e])};var h=function(t){var n=jQuery.extend({},t);var r=this;if(r.hoverIntent_t){r.hoverIntent_t=clearTimeout(r.hoverIntent_t)}if(t.type=="mouseenter"){u=n.pageX;a=n.pageY;e(r).on("mousemove.hoverIntent",f);if(r.hoverIntent_s!=1){r.hoverIntent_t=setTimeout(function(){l(n,r)},i.interval)}}else{e(r).off("mousemove.hoverIntent",f);if(r.hoverIntent_s==1){r.hoverIntent_t=setTimeout(function(){c(n,r)},i.timeout)}}};return this.on({"mouseenter.hoverIntent":h,"mouseleave.hoverIntent":h},i.selector)}})(jQuery);
(function($) {
  /**
   * handle hoverintent stuff for the menu
   */
  Drupal.behaviors.cbpGovHoverIntent = {
    attach: function (context) {
      // disable the default behavior for mouseover on the menu
      $('head style').last().after('<style type="text/css" media="all">\
        .om-maximenu ul.om-menu li.om-leaf:hover .om-maximenu-content-nofade{display: none;}\
        .om-maximenu-content.om-maximenu-content-nofade{\
          width: 1175px;\
        }\
        </style>');

      $('.om-maximenu li.om-leaf').hoverIntent({
        over: function() {
          $(this).addClass('hover');
          // show the menu content
          $('div.om-maximenu-content', this).addClass('open').removeClass('closed');
        },
        out: function() {
          $(this).removeClass('hover');
          // hide the menu content
          $('div.om-maximenu-content', this).addClass('closed').removeClass('open');
        },
//timeout: 10,
//interval: 10
//reassigned variables for delay testing 12/2/2015 pas
        timeout: 10,
        interval:400 
      });

      $('.om-maximenu li.om-leaf a')
        .focusin(function() {	 
        // show menu the content
        $(this).parents('li.om-leaf').addClass('hover').find('.om-maximenu-content').addClass('open').removeClass('closed');
        // cover the content area with a shaded div
        $('#zone-content').before('<div id="zone-content-shaded" class="container-12 shaded"></div>');
       })
      .focusout(function() {
        // hide the menu content
        $(this).parents('li.om-leaf').removeClass('hover').find('.om-maximenu-content').addClass('closed').removeClass('open');
        // remove the shaded div
        $('#zone-content-shaded').remove();
      });

    }

  };
})(jQuery);
;
jQuery(document).ready(function($) {
	
	//Css container classes for the image content
	var articleImageWapper = [
		".view-frontline-magazine-content-type",
		".view-frontline-landing-page"
	];
	
	for (var i = 0; i < articleImageWapper.length; i++){
		//Hover to display caption
		$('.node-type-frontline-magazine ' + articleImageWapper[i] + ' .views-row').each(function(){
			applyHoverSlide(this);
		});
		
		//Add class for departmental articles when features are odd, used for styling
		if ($('.node-type-frontline-magazine ' + articleImageWapper[i] + '.frontline-featured-block .views-row').length % 2 != 0) {			
			$('.node-type-frontline-magazine ' + articleImageWapper[i] + '.frontline-departmental-block .views-row').each(function(index, value){
				applyArticleGrouping(this, index);
			});
		}
	}
	
	function applyHoverSlide(element) {
		$(element).hoverIntent({
			over: function() {
				$(this).find('.caption-hover-slide').removeClass('active').slideToggle();	
			},
			out: function() {
				$(this).find('.caption-hover-slide').addClass('active').slideToggle();
			},
		});	
		
		$(element).focusin(function(){
			$(this).find('.caption-hover-slide').removeClass('active').slideToggle();
		})
		.focusout(function(){
			$(this).find('.caption-hover-slide').addClass('active').slideToggle();
		});
	}
	
	function applyArticleGrouping(element, index) {
		if (index < 4) {				
			$(element).addClass('odd-features-departmental-article-group');
		}	
	}
	
});;
(function ($) {
  Drupal.behaviors.cbpGovGlobalStylesOff = {
    attach: function (context) {
      // TSA-235 remove some elements that might normally be seen when the styles
      // are turned off
      $(window).scroll(function() {
         if (typeof $('body').css('background') === 'undefined' || $('body').css('background-image') === 'none') {
          // we know that the styles are turned off
          $('#_atssh iframe').remove();
          $('#colorbox button').remove();
        }
      });
    }
  };
})(jQuery);
;
jQuery(document).ready(function($){
  //Make is so login and request new password button have title attributes and no id Added by Patty 1/12/2017
  $("#user-login div #edit-actions input.form-submit").attr("title", "Log In").removeAttr("id");
  $("#user-pass div #edit-actions input.form-submit").attr("title", "E-mail new password").removeAttr("id"); 

  //Make it so usasearch button has same name and title attribute values
  $("#search-block-form input.form-submit").attr("title", "search-button").attr("name", "search-button").removeAttr("id");
  $("div.stl_container").attr("tabindex","0");


 /* 508 fixes for Media Release view and Blogs view
  * We changed the config of the date picker to be select and not popup. We wrap all the dropdowns in a fieldset and make the
  * Start/End Date labels a legend for the fieldset.  Then we remove the hidden labels for each dropdown (Ones used for Year,Month,etc)
  */
  if ($('.form-type-date-select').length > 0) {
    $('.form-type-date-select').wrapInner('<fieldset> </fieldset>');
    $('.form-item-field-date-release-value-min, .form-item-field-date-release-value-max').each(function() {
         $('label:first', this).replaceWith('<legend>' + $('label:first', this).html() + '</legend>');
    });
    //$('.form-type-date-select label').remove();
    //$('.form-type-date-select select').attr('title', $('.form-type-date-select select').attr('id')).removeAttr('id');
    if ($('#edit-field-date-release-value-wrapper label[for="edit-field-date-release-value"]:first').length > 0) {
       $('#edit-field-date-release-value-wrapper label:first')
         .replaceWith('<legend>' + $('#edit-field-date-release-value-wrapper label:first').html() + '</legend>');
    }
  }  

  /*
   * Remove 'id' attribute for submit buttons and replace with 'title' attribute
   */
  if ($('.views-submit-button input')) {
    $('.views-submit-button input').attr('title', Drupal.t('Submit Search')).removeAttr('id');
  }

  /*
   * Remove 'id' attribute from any reset button and replace with 'title' attribute
   */ 
  if ($('#edit-reset')) {
    $("#edit-reset").attr('title', Drupal.t('Reset')).removeAttr('id');
  }

  if ($(window).width() < 720) {
    resize();
  }

  $(window).resize(function (){
    resize();
  });

  function resize() {
    var search = $("#block-search-form");
    if ($(window).width() < 720 && !$("#region-menu #block-search-form").length) {
      $("#region-menu").append(search);
    } else if ($(window).width() > 720 && !$("#region-user-second #block-search-form").length) {
      $("#region-user-second").append(search);
    }
  }

  $(".site-name").replaceWith(function() {
    return $('<span class="site-name">').append($(this).contents());
  });

});
;
jQuery(document).ready(function($){

  $menu = Drupal.settings.mobile.menu;
  $(".region-menu-inner").append($menu);
  var coll = document.getElementsByClassName("collapsible");
  var i;

  for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
      this.parentElement.classList.toggle("active");
      var content = this.parentElement.nextElementSibling;
      if (content.style.display === "block") {
        content.style.display = "none";
      } else {
        content.style.display = "block";
      }
    });
  }
   $(".field-name-field-check-to-display-title").each(function (){
      if($(".field-item", this) && $(".field-item", this).text() == 'No'){
        $(this).siblings(".field-name-field-blocks-sidebar-right").find(".block-title").remove();
      }
      $(this).remove();
   });

  resize();

  $(window).resize(function() {
     if (($("#mobile-menu").css("display") == 'none' && $(window).width() < 725) || 
	($("#mobile-menu").css("display") == 'block' && $(window).width() > 725)) {
       resize();
     }
  });

  function resize() {
    if ($(window).width() < 725) {
       $('#block-om-maximenu-om-maximenu-1').css({"display" : "none"});
       $('#mobile-menu').css({"display" : "block"});
    } else {
       $('#mobile-menu').css({"display" : "none"});
       $('#block-om-maximenu-om-maximenu-1').css({"display" : "block"});
    }             
  }
  
  if (!$('.region-sidebar-second-inner').children().length && !$('.region-sidebar-first-inner').children().length) {
    $('#region-content').attr('style', 'width: 100%');
  } else if (!$('.region-sidebar-second-inner').children().length) {
    $('#region-content').attr('style', 'width: 75%');
  }
});
;
jQuery(document).ready(function() {
  jQuery("#region-content").wrap("<main></main>");
});
;
(function($) {

    $(window).bind('load', function() {
        $("#webform-client-form-212889").on("submit", function(e) {

            setTimeout(function() {
            	var radioValue = document.querySelector("input[name='submitted[are_you_a_us_citizen]']:checked").value;
            	var radioValue0 = document.querySelector("input[name='submitted[do_you_have_an_faa_commercial_or_atp_pilot_certificate]']:checked").value;
                var radioValue1 = document.querySelector("input[name='submitted[do_you_have_750_flight_hours_or_more]']:checked").value;
                var radioValue2 = document.querySelector("input[name='submitted[do_you_have_250_hours_of_pilot_in_command_time]']:checked").value;
                var radioValue3 = document.querySelector("input[name='submitted[do_you_have_75_hours_of_instrument_hood_time]']:checked").value;
                var radioValue4 = document.querySelector("input[name='submitted[do_you_have_75_night_hours]']:checked").value;
                var radioValue5 = document.querySelector("input[name='submitted[experience_flying_as_a_pilot_in_command_or_sole_manipulator_in_an_airplane_or_helicopter_in_all_environments_of_flight]']:checked").value;
                var radioValue6 = document.querySelector("input[name='submitted[do_you_currently_have_or_will_you_be_able_to_obtain_an_faa_class_1_or_class_2_medical_certificate]']:checked").value;
                var radioValue7 = document.querySelector("input[name='submitted[do_you_have_at_least_12_months_of_professional_aviation_experience]']:checked").value;
                if (radioValue == 'yes' && radioValue1 == 'yes' && radioValue2 == 'yes' && radioValue3 == 'yes'){
                    location = 'http://www.cbp.gov/careers/amo-apply';
                }
                else {
                    location = 'https://www.cbp.gov/node/212889/done?sid=46228';
                }
                return false;
            }, 1000);

        });

    });
})(jQuery);




;
