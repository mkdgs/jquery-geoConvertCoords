/**
 * @author mickael desgranges mickael.desgranges@bcbgeo.com
 * @desc http://bcbgeo.com
 * @version 1.0
 * 
 * http://en.wikipedia.org/wiki/Geographic_coordinate_conversion
 *   All of the following are valid and acceptable ways to write geographic coordinates:
 *   40:26:46N,79:56:55W
 *   40:26:46.302N 79:56:55.903W
 *   40°26′47″N 79°58′36″W
 *   40d 26′ 47″ N 79d 58′ 36″ W
 *   40.446195N 79.948862W
 *   40.446195, -79.948862
 *   40° 26.7717, -79° 56.93172
 *   return converted coord in degree like 40.446195, -79.948862 and null on error
 */		
(function( $ ){	
	"use strict";
	var methods = {};   
	var pluginName = 'geoConvertCoords';
	
	methods.init = function(params) {		
	    return this.each(function() { 
	 		var op = null;
			if ( !op ) {
				var options = {
						el_longitude	: '.longitude',
						el_latitude	    : '.latitude',
						
				};
				op = jQuery.extend(options, params);				
			    op.$el = $(this);
			    // set + config			    
			}
			op.$el = $(this);
			op.$longitude = $(op.el_longitude ,$(this));
			op.$latitude  = $(op.el_latitude  ,$(this));
			
			var changeLongitude = function () { 
				var v = $(this).val().split(',');					 
				if ( v && v.length == 2 ) {  
					$(this).val(v[1]);
					op.$latitude.val(v[0]).trigger('change');
				}		
				var longitude = methods.toDegree($(this).val(), 'longitude');
				if ( longitude ) {
					$(this).val(longitude);
					var latitude =  methods.toDegree(op.$latitude.val(), 'latitude');
					if ( latitude ) { 
						op.$el.trigger('coordinateChange', [latitude , longitude]);
					}
				}
			};					
			op.$longitude.bind('change', changeLongitude);			
				
			var changeLatitude = function () {
				var v = $(this).val().split(',');					
				if ( v && v.length == 2 ) { 
					$(this).val(v[0]);
					op.$longitude.val(v[1]).trigger('change');
				}
				var latitude = methods.toDegree($(this).val(), 'latitude');
				if ( latitude ) { 
					$(this).val(latitude);
					var longitude = methods.toDegree(op.$longitude.val(), 'longitude');
					if ( longitude ) {
						op.$el.trigger('coordinateChange', [latitude , longitude]);
					}
				}
			};				
			op.$latitude.bind('change', changeLatitude);			
		   	$(this).data(pluginName, op);	   	
	    });	
	};
	
	methods.invalidateCoords = function (latitude, longitude) {
		var maxLatitude = 90;
		var maxLongitude = 180;
		if ( !latitude || !longitude ) return 1;		
		if ( Math.abs(latitude)  <= maxLatitude  ) return 2;
		if ( Math.abs(longitude) <= maxLongitude ) return 3;
	};

	methods.invalidateBounds = function(swLat, swLong, neLat, neLong) {
		if ( !swLat || !swLong || !neLat || !neLong ) return 1;
		if ( !methods.validateCoords(swLat, swLong) ) return 2;
		if ( !methods.validateCoords(neLat, neLong) ) return 3;
		
		///if ( neLat >= )
		
	};
	
	methods.longitudeToDegree = function(value) {	
		return methods.toDegree(value, 'longitude');
	};
	
	methods.latitudeToDegree = function(value) {	
		return methods.toDegree(value, 'latitude');
	};
	
	methods.toDegree = function(value, type) {		
		 //var op = $(this).data(pluginName);		
		   
			var dmsToDd = function (days, minutes, seconds, direction) {
			    var dd = parseInt(days) + parseFloat(minutes)/60 + parseFloat(seconds)/(60*60);
			    return parseFloat(dd*direction);	
			};
			var max,r = null;
			if ( type == 'longitude' ) max = 180;
			else if ( type == 'latitude' ) max = 90;
			else return;								
			
			var v = value.match(/[\d.]+/g);
			if ( !v ) return; 
			var t = new RegExp('[sw]','i');
			var direction =  ( t.test(value) ) ? -1 : 1;
			// S||W -1	anything for N || E				

			switch(v.length) {
				case 3:
					if ( Math.abs(v[0]) <= max && Math.abs(v[1]) < 60 && Math.abs(v[2]) < 60 )  {							
						r = dmsToDd(v[0], v[1], v[2], direction);
					}
					break;
					
				case 2:
					if ( Math.abs(v[0]) <= max && Math.abs(v[1]) < 60)  {
						r = dmsToDd(v[0], v[1], 0, direction);
					}
					break;

				case 1:
					if ( Math.abs(v[0]) <= max ) r = parseFloat(v[0]) * direction;
					break;							
			} 
			return r;				
	};
	
	$.fn[pluginName] = function(m) {
			if (methods[m]) { return methods[m].apply(this, Array.prototype.slice.call(arguments, 1)); } 
			else if (typeof m === 'object' || !m) return methods.init.apply(this, arguments);
			else $.error(pluginName+' Method ' + m + ' fail ');
	};
		    
})( jQuery );
