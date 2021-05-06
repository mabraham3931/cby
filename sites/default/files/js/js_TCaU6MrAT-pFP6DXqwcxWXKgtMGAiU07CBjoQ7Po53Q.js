jQuery(document).ready(function($) {
 
  $('.collapse').collapse({ toggle: false });

  var $collapse = $(".accordion-button .collapse-container").remove(); //Get Collapse All container and remove it
  var $expand = $(".accordion-button .expand-container"); //Get Expand All container but don't remove on load.
  var $accordion_count = $('.panel-title').length; //Get the number of accordion items.

  /*
   * Click handler for the Expand All and Collapse All buttons.
   * If the collapseAll button exists then collapse the accordions.
   * Else the expandAll button must exist then expand the accordions.
   */
  $('.accordion-button-container').on('click', '#expandAll', function() {   
    if($(".collapse-container").length){
      $(".accordion.container .collapse").collapse('hide');
    }
    else {
      $(".accordion.container .collapse").collapse('show');
    }
  });

  /*
   * Keypress handler for the accordion.
   * Currently pressing enter does nothing so we have to manually open/close.
   * If the opening content has any tabable element move the focus to that.
   */
  $('.accordion.container .panel-group .panel-default .panel-heading').keydown(function(e) {
    if((e.keyCode || e.which) == 13){
      if($(this).hasClass("collapsed")) {
        var $sibling = $(this).siblings(".collapse");
        $sibling.collapse('show');
        if($($sibling, '.panel-body').find('a, button, :input, [tabindex]').length){
          e.preventDefault();
          var $canfocus = $(':focusable');
          var index = $canfocus.index(document.activeElement) + 1;
          if (index >= $canfocus.length) index = 0;
          $canfocus.eq(index).focus();
        }
      } 
      else {
        $(this).siblings(".collapse").collapse('hide');
      }
    } 
  });

  /*
   * Plugin that I found online. Used to help with the keypress function above
   */
  jQuery.extend(jQuery.expr[':'], {
    focusable: function (el, index, selector) {
      return $(el).is('a, button, :input, [tabindex]');
    }
  });
  
  /*
   * Bootstrap listener when accordion expands.
   * Check if all accordions are expanded if so then change Expand ALl/Collapse All button.
   * Also regardless toggle the glyphicon.
   */
  $('.collapse').on('shown.bs.collapse', function (){
    $(this).addClass("active");
    if($('.accordion.container .collapse.active').length == $accordion_count){
      replaceExpandAll();     
    }
    toggleIcons(this);
  });

  /*
   * Bootstrap listener when accordion collapses.
   * Check if all accordions are collapsed is so then change Expand All/Collapse All button.
   * Also regardless toggle the glyphicon.
   */
  $('.collapse').on('hidden.bs.collapse', function (){
    $(this).removeClass("active");
    if($('.accordion.container .collapse.active').length != $accordion_count){
      if(!$('.expand-container').length){
        replaceCollapseAll();
      }
    }
    toggleIcons(this);
  });

  /*
   * If the URL has a hash part then it's looking for an anchor on the page.
   * 1st get the anchor from the page.
   * 2nd find the accordion being referenced and open it.
   * 3rd put focus on opened accordion.
   */
  if(window.location.hash) {
    var $anchor = window.location.hash.substr(1);
    $(".accordion.container div[href=#" + $anchor + "]").collapse('show');
    $(".accordion.container div[href=#" + $anchor + "]").focus();
  }

  /*
   * Function used to switch the glyphicons when an accordion opens or closes and changes the alt text
   * to be 508 compliant.
   * @thisObj - 'this' variable from the jQuery listener calling this function
   */
  function toggleIcons($thisObj){
    if($($thisObj).hasClass("active")){
      $($thisObj).parent().find(".glyphicon-chevron-right").removeClass("glyphicon-chevron-right").addClass("glyphicon-chevron-down");
      $($thisObj).parent().find(".glyphicon-chevron-down").attr({alt: "Accordion Section is Expanded. Click to Collapse."});
    }
    else {
      $($thisObj).parent().find(".glyphicon-chevron-down").removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-right");
      $($thisObj).parent().find(".glyphicon-chevron-right").attr({alt: "Accordion Section is Collapsed. Click to Expand."});
    }
  }

  /*
   * Function to remove the Collapse All container and add Expand All container.
   */
  function replaceCollapseAll(){
    $($collapse).remove();
    $(".accordion-button").append($expand);
  }

  /*
   * Function to remove Expand All container and add Collapse All container.
   */
  function replaceExpandAll() {
    $($expand).remove();
    $(".accordion-button").append($collapse);
  }

  $(window).resize(function() {
    if ($(window).width() < 725 && $("body").hasClass("node-type-tab-page")) {
     $(".node-type-tab-page .container .collapse").removeClass("in");
     $(".panel-heading .glyphicon").removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-right")
       .attr({alt: "Accordion Section is Collapsed. Click to Expand."});
    } else if ($(window).width() > 725 &&  $("body").hasClass("node-type-tab-page")) {
      $(".node-type-tab-page .container .collapse").addClass("in").css({'height' : ''});
    }
  });

  $(window).trigger('resize');

});
;
/**
 * @file
 */

(function ($) {

  'use strict';

  Drupal.extlink = Drupal.extlink || {};

  Drupal.extlink.attach = function (context, settings) {
    if (!settings.hasOwnProperty('extlink')) {
      return;
    }

    // Strip the host name down, removing ports, subdomains, or www.
    var pattern = /^(([^\/:]+?\.)*)([^\.:]{1,})((\.[a-z0-9]{1,253})*)(:[0-9]{1,5})?$/;
    var host = window.location.host.replace(pattern, '$2$3$6');
    var subdomain = window.location.host.replace(host, '');

    // Determine what subdomains are considered internal.
    var subdomains;
    if (settings.extlink.extSubdomains) {
      subdomains = '([^/]*\\.)?';
    }
    else if (subdomain === 'www.' || subdomain === '') {
      subdomains = '(www\\.)?';
    }
    else {
      subdomains = subdomain.replace('.', '\\.');
    }

    // Build regular expressions that define an internal link.
    var internal_link = new RegExp('^https?://([^@]*@)?' + subdomains + host, 'i');

    // Extra internal link matching.
    var extInclude = false;
    if (settings.extlink.extInclude) {
      extInclude = new RegExp(settings.extlink.extInclude.replace(/\\/, '\\'), 'i');
    }

    // Extra external link matching.
    var extExclude = false;
    if (settings.extlink.extExclude) {
      extExclude = new RegExp(settings.extlink.extExclude.replace(/\\/, '\\'), 'i');
    }

    // Extra external link CSS selector exclusion.
    var extCssExclude = false;
    if (settings.extlink.extCssExclude) {
      extCssExclude = settings.extlink.extCssExclude;
    }

    // Extra external link CSS selector explicit.
    var extCssExplicit = false;
    if (settings.extlink.extCssExplicit) {
      extCssExplicit = settings.extlink.extCssExplicit;
    }

    // Define the jQuery method (either 'append' or 'prepend') of placing the icon, defaults to 'append'.
    var extIconPlacement = settings.extlink.extIconPlacement || 'append';

    // Find all links which are NOT internal and begin with http as opposed
    // to ftp://, javascript:, etc. other kinds of links.
    // When operating on the 'this' variable, the host has been appended to
    // all links by the browser, even local ones.
    // In jQuery 1.1 and higher, we'd use a filter method here, but it is not
    // available in jQuery 1.0 (Drupal 5 default).
    var external_links = [];
    var mailto_links = [];
    $('a:not([data-extlink]), area:not([data-extlink])', context).each(function (el) {
      try {
        var url = '';
        if (typeof this.href == 'string') {
          url = this.href.toLowerCase();
        }
        // Handle SVG links (xlink:href).
        else if (typeof this.href == 'object') {
          url = this.href.baseVal;
        }
        if (url.indexOf('http') === 0
          && ((!url.match(internal_link) && !(extExclude && url.match(extExclude))) || (extInclude && url.match(extInclude)))
          && !(extCssExclude && $(this).is(extCssExclude))
          && !(extCssExclude && $(this).parents(extCssExclude).length > 0)
          && !(extCssExplicit && $(this).parents(extCssExplicit).length < 1)) {
          external_links.push(this);
        }
        // Do not include area tags with begin with mailto: (this prohibits
        // icons from being added to image-maps).
        else if (this.tagName !== 'AREA'
          && url.indexOf('mailto:') === 0
          && !(extCssExclude && $(this).parents(extCssExclude).length > 0)
          && !(extCssExplicit && $(this).parents(extCssExplicit).length < 1)) {
          mailto_links.push(this);
        }
      }
      // IE7 throws errors often when dealing with irregular links, such as:
      // <a href="node/10"></a> Empty tags.
      // <a href="http://user:pass@example.com">example</a> User:pass syntax.
      catch (error) {
        return false;
      }
    });

    if (settings.extlink.extClass) {
      Drupal.extlink.applyClassAndSpan(external_links, settings.extlink.extClass, extIconPlacement);
    }

    if (settings.extlink.mailtoClass) {
      Drupal.extlink.applyClassAndSpan(mailto_links, settings.extlink.mailtoClass, extIconPlacement);
    }

    if (settings.extlink.extTarget) {
      // Apply the target attribute to all links.
      $(external_links).attr('target', settings.extlink.extTarget);
      // Add rel attributes noopener and noreferrer.
      $(external_links).attr('rel', function (i, val) {
        // If no rel attribute is present, create one with the values noopener and noreferrer.
        if (val == null) {
          return 'noopener noreferrer';
        }
        // Check to see if rel contains noopener or noreferrer. Add what doesn't exist.
        if (val.indexOf('noopener') > -1 || val.indexOf('noreferrer') > -1) {
          if (val.indexOf('noopener') === -1) {
            return val + ' noopener';
          }
          if (val.indexOf('noreferrer') === -1) {
            return val + ' noreferrer';
          }
          // Both noopener and noreferrer exist. Nothing needs to be added.
          else {
            return val;
          }
        }
        // Else, append noopener and noreferrer to val.
        else {
          return val + ' noopener noreferrer';
        }
      });
    }

    Drupal.extlink = Drupal.extlink || {};

    // Set up default click function for the external links popup. This should be
    // overridden by modules wanting to alter the popup.
    Drupal.extlink.popupClickHandler = Drupal.extlink.popupClickHandler || function () {
      if (settings.extlink.extAlert) {
        return confirm(settings.extlink.extAlertText);
      }
    };

    $(external_links).click(function (e) {
      return Drupal.extlink.popupClickHandler(e, this);
    });
  };

  /**
   * Apply a class and a trailing <span> to all links not containing images.
   *
   * @param {object[]} links
   *   An array of DOM elements representing the links.
   * @param {string} class_name
   *   The class to apply to the links.
   * @param {string} icon_placement
   *   'append' or 'prepend' the icon to the link.
   */
  Drupal.extlink.applyClassAndSpan = function (links, class_name, icon_placement) {
    var $links_to_process;
    if (Drupal.settings.extlink.extImgClass) {
      $links_to_process = $(links);
    }
    else {
      var links_with_images = $(links).find('img').parents('a');
      $links_to_process = $(links).not(links_with_images);
    }
    // Add data-extlink attribute.
    $links_to_process.attr('data-extlink', '');
    var i;
    var length = $links_to_process.length;
    for (i = 0; i < length; i++) {
      var $link = $($links_to_process[i]);
      if ($link.css('display') === 'inline' || $link.css('display') === 'inline-block') {
        if (Drupal.settings.extlink.extUseFontAwesome) {
          if (class_name === Drupal.settings.extlink.mailtoClass) {
            $link[icon_placement]('<span class="fa-' + class_name + ' extlink"><span class="fa fa-envelope-o" title="' + Drupal.settings.extlink.mailtoLabel + '"></span><span class="element-invisible">' + Drupal.settings.extlink.mailtoLabel + '</span></span>');
          }
          else {
            $link[icon_placement]('<span class="fa-' + class_name + ' extlink"><span class="fa fa-external-link" title="' + Drupal.settings.extlink.extLabel + '"></span><span class="element-invisible">' + Drupal.settings.extlink.extLabel + '</span></span>');
          }
        }
        else {
          if (class_name === Drupal.settings.extlink.mailtoClass) {
            $link[icon_placement]('<span class="' + class_name + '"><span class="element-invisible">' + Drupal.settings.extlink.mailtoLabel + '</span></span>');
          }
          else {
            $link[icon_placement]('<span class="' + class_name + '"><span class="element-invisible">' + Drupal.settings.extlink.extLabel + '</span></span>');
          }
        }
      }
    }
  };

  Drupal.behaviors.extlink = Drupal.behaviors.extlink || {};
  Drupal.behaviors.extlink.attach = function (context, settings) {
    // Backwards compatibility, for the benefit of modules overriding extlink
    // functionality by defining an "extlinkAttach" global function.
    if (typeof extlinkAttach === 'function') {
      extlinkAttach(context);
    }
    else {
      Drupal.extlink.attach(context, settings);
    }
  };

})(jQuery);
;
jQuery(document).ready(function($) {

  $(".social-images a").hide();

  $(".social-images a").each(function() {
   var url = window.location.href;
   var href = $(this).attr("href").replace("UNIURL", url);
   $(this).attr({href: href});
  });

  toggleClass();

  $(window).resize(function() {
   toggleClass();
  });

  $(".socialImagesDiv").click(function(e) {
   var container = "#showThisPageContainer";
   if (!$(this.id + container).hasClass("open")) {
     e.preventDefault();
     $(this.id + container).addClass("open");
     $(this.id + ".mobile").addClass("open");
     $(".social-images a").finish().show(1000);
     $(".social-images a:first").focus();
     $(this.id + ".icon-show img").attr({"alt": Drupal.t("Click to close 'Share this page' social icons")});
   } else if ($(this.id + container).hasClass("open")) {
     e.preventDefault();
     $(this.id + container).removeClass("open");
     $(this.id + ".mobile").removeClass("open");
     $(".social-images a").finish().hide(1000);
     $(this.id + container).focus();
     $(this.id + ".icon-show img").attr({"alt": Drupal.t("Click to open 'Share this page' social icons")});
   }
  });

  $(".socialImagesDiv").keydown(function(e) {
    if(e.keyCode == 13) {
     e.preventDefault();
     $(this).click();
    }
  });

  function toggleClass() {
    if ($(window).width() < 405) {
      $(".socialImagesDiv").addClass("mobile");
      if ($(".socialImagesDiv #showThisPageContainer").hasClass("open")) {
        $(".socialImagesDiv").addClass("open");
      }
      $(".socialImagesDiv").removeClass("desktop");
    } else {
      $(".socialImagesDiv").addClass("desktop");
      $(".socialImagesDiv").removeClass("mobile");
    }
  }

});
;
/**
 * @file Common data layer helper.
 */

(function ($) {
  Drupal.behaviors.dataLayer = {

    /**
     * The language prefix list (no blank).
     *
     * @return {array}
     */
    langPrefixes: function langPrefixes() {
      var languages = Drupal.settings.dataLayer.languages,
          langList = [];

      for (var lang in languages) {
        if (languages[lang].prefix !== '') {
          langList.push(languages[lang].prefix);
        }
      }
      return langList;

      // With Underscore.js dependency.
      //var list = _.pluck(Drupal.settings.datalayer.languages, 'prefix');
      //return _.filter(list, function(lang) { return lang });
    },

    /**
     * Drupal behavior.
     */
    attach: function() { return }

  };
})(jQuery);
;

jQuery(document).ready(function($) {

	//Remove blocks with no content
	$(".region-sidebar-second-inner").children().each(function(index){
		$(this).find('.view-content .views-row').each(function(){
			if ($(this).children().length < 2 &&
				$(this).find('.field-content').first(':first').is(':empty') || 
				$(this).find('.field-content').first(':first').find('.first').is(':empty')) {
					$(this).remove();
			} 
		});
		
		$(this).find('.view-list-page .view-content').each(function(){					
			if ($(this).children().length == 0) {
				$(this).parent().remove();				
			}
		});
	});
	
	$('.mobile_nav_button').click(function(){
		$('#region-menu').toggleClass('mobile_nav_visible', !$('#region-menu').hasClass('mobile_nav_visible'));
	});
	
	//Darken content area when hovering maximenu
	$('.om-link').mouseenter(
		function(){		
			$('#zone-content').before('<div id="zone-content-shaded" class="container-12 shaded"></div>');
		})
				.mouseleave(
		function(){
			$('#zone-content-shaded').remove();
		}
	);
	
	$('.om-maximenu-content').mouseenter(
		function(){		
			$('#zone-content').before('<div id="zone-content-shaded" class="container-12 shaded"></div>');
		})
				.mouseleave(
		function(){
			$('#zone-content-shaded').remove();
		}
	);
	
	if (jQuery("html").hasClass("ie8")) {	
		jQuery('body').prepend('<div id="ie8-bg"><img src="' + jQuery('html.js').css('background-image').replace('url("',"").replace('")',"") + '" alt="" /></div>');
	}

	//Travel Menu wrapper
	var travelMenu = [ 
		{
			"featured" : ".block-views-id-menu_featured_item-block_5",
			"menu" 	   : ".block-boxes-id-menu_travel_citizen_lpr",
		},
		{
			"featured" : ".block-views-id-menu_featured_item-block_7",
			"menu" 	   : ".block-boxes-id-menu_travel_visitors",
		},
		{
			"featured" : ".block-views-id-menu_featured_item-block_6",
			"menu" 	   : ".block-boxes-id-menu_travel_trusted",
		},
	]
	
	//Travel maximenu items needs to have a div container for styling
	$.each(travelMenu, function(i, item) {		
		if ($(travelMenu[i].featured)[0]) {		
			$("<div class='travel-block-group'>")
				.insertBefore(travelMenu[i].featured)
				.append($(travelMenu[i].featured + "," + travelMenu[i].menu));
		} else {
			$(travelMenu[i].menu).wrap("<div class='travel-block-group' />")
		}
	});
	
	//Trade Menu wrapper

	var tradeMenu = [ 
		{
			"featured" : ".block-views-id-menu_featured_item-block_8",
			"menu" 	   : ".block-boxes-id-menu_trade_import_export",
		},
		{
			"featured" : ".block-views-id-menu_featured_item-block_9",
			"menu" 	   : ".block-boxes-id-menu_trade_resources",
		},
		{
			"featured" : ".block-views-id-menu_featured_item-block_10",
			"menu" 	   : ".block-boxes-id-menu_trade_automated_systems",
		},
		{
			"featured" : ".block-views-id-menu_featured_item-block_11",
			"menu" 	   : ".block-boxes-id-menu_trade_outreach",
		},
	]
		//Trade maximenu items needs to have a div container for styling 4 columns
	$.each(tradeMenu, function(i, item) {		
		if ($(tradeMenu[i].featured)[0]) {		
		$("<div class='travel-block-group' style='width:22%;'>")
				.insertBefore(tradeMenu[i].featured)
				.append($(tradeMenu[i].featured + "," + tradeMenu[i].menu));
		} else {
			$(tradeMenu[i].menu).wrap("<div class='travel-block-group' style='width:22%;' />")
		}
	});


	//Newsroom Menu wrapper
	// YOU MUST REPLACE THE block number BELOW WITH THE NUMBER FOR EACH BLOCK
	var newsroomMenu = [ 
		{
			"featured" : ".block-views-id-menu_featured_item-block_12",
			"menu" 	   : ".block-boxes-id-menu_newsroom_media_public",
		},
		{
			"featured" : ".block-views-id-menu_featured_item-block_13",
			"menu" 	   : ".block-boxes-id-menu_newsroom_imagery",
		},
		{
			"featured" : ".block-views-id-menu_featured_item-block_14",
			"menu" 	   : ".block-boxes-id-menu_newsroom_background",
		},
		{
			"featured" : ".block-views-id-menu_featured_item-block_15",
			"menu" 	   : ".block-boxes-id-menu__newsroom_publications",
		},
	]
		//Newsroom maximenu items needs to have a div container for styling 4 columns
	$.each(newsroomMenu, function(i, item) {		
		if ($(newsroomMenu[i].featured)[0]) {		
			$("<div class='travel-block-group' style='width:22%;'>")
				.insertBefore(newsroomMenu[i].featured)
				.append($(newsroomMenu[i].featured + "," + newsroomMenu[i].menu));
		} else {
			$(newsroomMenu[i].menu).wrap("<div class='travel-block-group' style='width:22%;' />")
		}
	});
	
		//Border Security Menu wrapper
	// YOU MUST REPLACE THE block number BELOW WITH THE NUMBER FOR EACH BLOCK
	var bordersecurityMenu = [ 
		{
			"featured" : ".block-views-id-menu_featured_item-block_1",
			"menu" 	   : ".block-boxes-id-menu_border_security",
		},
		{
			"featured" : ".block-views-id-menu_featured_item-block_19",
			"menu" 	   : ".block-boxes-id-menu_border_security_feature_2",
		},
		{
			"featured" : ".block-views-id-menu_featured_item-block_20",
			"menu" 	   : ".block-boxes-id-menu_border_security_feature_3",
		},
		{
			"featured" : ".block-views-id-menu_featured_item-block_21",
			"menu" 	   : ".block-boxes-id-menu_border_security_feature_4",
		},
	]
	
	// IF YOU ONLY HAVE 3, REMOVE THE style="'with:22%' FROM THE DIV BELOW
		//Border Security maximenu items needs to have a div container for styling 4 columns
	$.each(bordersecurityMenu, function(i, item) {		
		if ($(bordersecurityMenu[i].featured)[0]) {		
			$("<div class='travel-block-group' style='width:22%;'>")
				.insertBefore(bordersecurityMenu[i].featured)
				.append($(bordersecurityMenu[i].featured + "," + bordersecurityMenu[i].menu));
		} else {
			$(bordersecurityMenu[i].menu).wrap("<div class='travel-block-group' style='width:22%;' />")
		}
	});
	
			//About Menu wrapper
	// YOU MUST REPLACE THE block number BELOW WITH THE NUMBER FOR EACH BLOCK
	var aboutcbpMenu = [ 
		{
			"featured" : ".block-views-id-menu_featured_item-block",
			"menu" 	   : ".block-boxes-id-menu_about_cbp",
		},
		{
			"featured" : ".block-views-id-menu_featured_item-block_16",
			"menu" 	   : ".block-boxes-id-menu_about_cbp_feature_2",
		},
		{
			"featured" : ".block-views-id-menu_featured_item-block_17",
			"menu" 	   : ".block-boxes-id-menu_about_cbp_feature_3",
		},
		{
			"featured" : ".block-views-id-menu_featured_item-block_18",
			"menu" 	   : ".block-boxes-id-menu_about_cbp_feature_4",
		},
	]
	
	// IF YOU ONLY HAVE 3, REMOVE THE style="'with:22%' FROM THE DIV BELOW
		//About CBP maximenu items needs to have a div container for styling 4 columns
	$.each(aboutcbpMenu, function(i, item) {		
		if ($(aboutcbpMenu[i].featured)[0]) {		
			$("<div class='travel-block-group' style='width:22%;'>")
				.insertBefore(aboutcbpMenu[i].featured)
				.append($(aboutcbpMenu[i].featured + "," + aboutcbpMenu[i].menu));
		} else {
			$(aboutcbpMenu[i].menu).wrap("<div class='travel-block-group' style='width:22%;' />")
		}
	});

			//Careers Menu wrapper
	// YOU MUST REPLACE THE block number BELOW WITH THE NUMBER FOR EACH BLOCK
	var careersMenu = [ 
		{
			"featured" : ".block-views-id-menu_featured_item-block_2",
			"menu" 	   : ".block-boxes-id-menu_careers",
		},
		{
			"featured" : ".block-views-id-menu_featured_item-block_22",
			"menu" 	   : ".block-boxes-id-menu_careers_feature_2",
		},
		{
			"featured" : ".block-views-id-menu_featured_item-block_23",
			"menu" 	   : ".block-boxes-id-menu_careers_feature_3",
		},
		{
			"featured" : ".block-views-id-menu_featured_item-block_24",
			"menu" 	   : ".block-boxes-id-menu_careers_feature_4",
		},
	]
	
	// IF YOU ONLY HAVE 3, REMOVE THE style="'with:22%' FROM THE DIV BELOW
		//Careers maximenu items needs to have a div container for styling 4 columns
	$.each(careersMenu, function(i, item) {		
		if ($(careersMenu[i].featured)[0]) {		
			$("<div class='travel-block-group' style='width:22%;'>")
				.insertBefore(careersMenu[i].featured)
				.append($(careersMenu[i].featured + "," + careersMenu[i].menu));
		} else {
			$(careersMenu[i].menu).wrap("<div class='travel-block-group' style='width:22%;' />")
		}
	});


});
;
