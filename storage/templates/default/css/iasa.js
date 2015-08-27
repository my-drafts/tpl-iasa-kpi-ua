$(function(){
	$("#metabanner").each(function(){
		$("#metabanner_next").click(function(){
			var 
				holder = $(this).parent().children('.inside'),
				curr = holder.children(".current:not(:animated)")
				next = curr.next();
				
			if(curr.length==0)
				return false;
				
			curr.removeClass('current').css({zIndex:1,display:'block'}).stop().animate({left: -holder.width()-400},1000,function(){$(this).css('display','none')});
			if(next.length == 0)
				next = holder.children("div:first");
			next.addClass("current").css({left: holder.width(),zIndex:2,display:'block'}).stop().animate({left: 0},500);
			
			$("#metabanner>.list>.current").removeClass("current");
			$("#metabanner>.list>a:eq("+next.prevAll().length+")").addClass("current");
			
			return false;
		});
		$("#metabanner_prev").click(function(){
			var 
				holder = $(this).parent().children('.inside'),
				curr = holder.children(".current:not(:animated)")
				prev = curr.prev();
				
			if(curr.length==0)
				return false;
				
			curr.removeClass('current').css({zIndex:1,display:'block'}).stop().animate({left: holder.width()+400},1000,function(){$(this).css('display','none')});
			if(prev.length == 0)
				prev = holder.children("div:last");
			prev.addClass("current").css({left: -holder.width(),zIndex:2,display:'block'}).stop().animate({left: 0},500);
			
			$("#metabanner>.list>.current").removeClass("current");
			$("#metabanner>.list>a:eq("+prev.prevAll().length+")").addClass("current");
			
			return false;
		});
		
		$("#metabanner>.list>a").click(function(){
			if( !$(this).hasClass('current') ) {
				var holder = $('#metabanner>.inside');
				$("#metabanner>.inside>.current").removeClass('current').css({zIndex:1,display:'block'}).stop().animate({left: -holder.width()},1000,function(){$(this).css('display','none')});
				$("#metabanner>.inside>div:eq("+$(this).prevAll().length+")").addClass("current").css({left: holder.width(),zIndex:2,display:'block'}).stop().animate({left: 0},500);
				$(this).addClass("current");
				$(this).siblings(".current").removeClass("current");
			}
			return false;
		});
		
		var metabannerTimer = function(){
			$("#metabanner_next").trigger('click');
			timer = setTimeout( metabannerTimer, 10000 );
		},
		timer = setTimeout(metabannerTimer, 10000);
		
		$(this).mouseenter(function(){
			$(this).children("#metabanner_next, #metabanner_prev").stop().animate({opacity: 1},500);
			clearTimeout(timer);
			timer = false;
		})
		.mouseleave(function(){
			$(this).children("#metabanner_next, #metabanner_prev").stop().animate({opacity: .2},500);
			if( !timer )
				timer = setTimeout(metabannerTimer, 5000);
		})
		$(this).children("#metabanner_next, #metabanner_prev").css('opacity',.2);
	})
	$("ul.menu").each(function(){
		$(this).children().each(function(){
			if( $(this).hasClass("curr") ){
				$(this).removeClass("curr").addClass("nowel").addClass("pageel")
					.children("a").css({top:6, opacity: .7});
				$("<div class='jsBg'><div class='sel'><a></a></div></div>").appendTo(this);
				
				$(this).children(".secondMenu").css({display: 'block', marginTop: 7})
					.children().css({ left: 0, top: 0 })
					.wrap("<div>").parent().css({height: 23, marginLeft: 15, overflow: 'hidden', background: 'none', padding: 0, width: $(this).children(".secondMenu").width()-20})
			}
			else{
				$("<div class='jsBg'><div class='sel'><a></a></div></div>").appendTo(this)
					.children().css({top: 28});
				
				$(this).children(".secondMenu").css({display: 'block', marginTop: 7}).hide()
					.children().css({ left: 0, top: -23 })
					.wrap("<div>").parent().css({height: 23, marginLeft: 15, overflow: 'hidden', background: 'none', padding:0, width: $(this).children(".secondMenu").width()-20})
			}
		})
		.children("a").bind('mouseenter', function(){
			if( $(this).parent().hasClass("nowel") )
				return true;
			
			$("ul.menu>li.nowel").each(function(){
				$(this).removeClass("nowel")
					.children("a").stop().animate({top: 0, opacity: 1}, 200).end()
					.children(".jsBg").children().stop().animate({top: 28},200);
				
				$(this).children(".secondMenu").hide().children().children().stop().animate({top: -23},200,
					function(){$(this).parents(".secondMenu").hide()});
			});
			
			$(this).stop().animate({top: 6, opacity: .7}, 200)
				.parent().addClass("nowel")
				.children(".jsBg").children().stop().animate({top: 5},200);
			
			var sm = $(this).parent().children(".secondMenu");
			
			sm.css({marginLeft: 0}).show().children().children().stop().animate({top: -23},200).animate({top: 0},200);
			
			sm.css({marginLeft: 
				sm.children().offset().left < 20 ?
					20-sm.children().offset().left :
					Math.min($(".page").width() - 20 - sm.children().offset().left - sm.children().width(), 0)
			});
			return false;
		});
		
		$(this).bind({ 
			mouseleave: function(){
				$(this).data('timer',setTimeout(function(){
					var now = $('ul.menu>li.pageel a');
					if( now.length>0 )
						now.trigger('mouseenter');
					else
						$("ul.menu>li.nowel").each(function(){
							$(this).removeClass("nowel")
								.children("a").stop().animate({top: 0, opacity: 1}, 200).end()
								.children(".jsBg").children().stop().animate({top: 28},200);
							
							$(this).children(".secondMenu").hide().children().children().stop().animate({top: -23},200,
								function(){$(this).parents(".secondMenu").hide()});
						});
				}, 700));
			},
			mouseenter: function(){
				if( $(this).data('timer') )
					clearTimeout($(this).data('timer'));
				$(this).data('timer',null);
			}
		});
		
		$(window).resize(function() {
			var sm = $("ul.menu>li.nowel>.secondMenu").css({marginLeft: 0});
			if( !sm.length )
				return;
			sm.css({marginLeft: 
				sm.children().offset().left < 20 ?
					20-sm.children().offset().left :
					Math.min($(".page").width() - 20 - sm.children().offset().left - sm.children().width(), 0)
			});
		}).trigger('resize');
	});
	$("#courses").each(function(){
		$("#courses>.stages a").click(function(){
			$("#courses>.stages .selected").removeClass('selected');
			var pos = $(this).parents('td').addClass('selected').prevAll().length;
			$("#courses>.discription").each(function(){
				$(this).css({display: 'block', height: $(this).height(), opacity: 0});
				var h = $(this).children().hide().eq(pos).show().height();
				$(this).animate({opacity: 1, height: h}, 300, function(){ $(this).css({height: 'auto'})});
			});
			return false;
		}).each(function(){
			if( $(this).parents('td').hasClass('selected') ) {
				$("#courses>.stages .selected").removeClass('selected');
				var pos = $(this).parents('td').addClass('selected').prevAll().length;
				$("#courses>.discription").each(function(){
					$(this).css({display: 'block', height: $(this).height(), opacity: 0});
					var h = $(this).children().hide().eq(pos).show().height();
					$(this).animate({opacity: 1, height: h}, 300, function(){ $(this).css({height: 'auto'})});
				});
			}
		});
	});
	$(".auth>.login-link").click(function(){
		$("#login-form").fadeIn(300).css('display','table');
		return false;
	});
	$("#login-form a.close").click(function(){
		$(this).parents('.bubble').fadeOut(300);
		return false;
	});
	$(".bubble>div>div>div>.close").click(function(){
		$(this).parents('.bubble').fadeOut(300);
	});
	
	var id = window.location.hash.replace(/^#/,'');
	$("div.collapsed-list>h4>a").click(function(){
		$(this).toggleClass('off').parent().next('div').toggle(300);
		return false;
	}).each(function(){
		var tid = $(this).attr('href').replace(/^.*#/,'');
		if( id && tid == id )
			$(this).addClass('off').parent().next('div').show();
	});
	
	$("#twitter").each(function(){
		if( !$.fn.tweet )
			return;
		$(this)
			.parent().css('display', 'block').end()
			/*
			.bind({
				loaded: function(){ 
					if( $("#twitter").children().length == 0 )
						$("#twitter").html('F');
					alert(1);
				}
			})*/
			.tweet({
				query: "#iasa_kpi",
				join_text: "auto",
				avatar_size: 48,
				count: 7,
				refresh_interval: 10,
				template: '{avatar}<div><h6>{user}</h6><p>{text}</p><span class="date">{time}</span></div>'
			});
	});
	$(".text-image>img").each(function(){
		if( $(this).attr('src').match(/\/image_\w+$/) ){
			$(this).parent().css({cursor: 'pointer'}).click(function(){
				$('<div class="bubble" id="image-box" style="display: table"><div><div><div> \
					<a class="close" href="#">×</a><img src="'
					+ $(this).find('img').attr('src').replace(/\/image_\w+$/,'') +
					'/image_large" style="max-width:'+Math.round($(window).width()*.85)+'px; max-height:'+Math.round($(window).height()*.85)+'px;"/></div></div></div>').appendTo('body').hide().fadeIn(300)
				.find('a.close').click(function(){
					$(this).parents('.bubble').fadeOut(300, function(){ $(this).remove() });
                    $("body").css('overflow','auto');
					return false;
				});
				
				$("body").css('overflow','hidden');
				return false;
			});
		}
	});
    
    $(".media.photo>a").bind('click', function(){
        //$("#photo-content>img").attr('src', );
        
        $("#photo-content").css({height: $("#photo-content").height() });
        $("#photo-content>div").animate({left: '-50%', opacity: 0}, function(){ $(this).remove(); });
        
        $("<div><img/><p></p></div>").appendTo('#photo-content')
            .css({position: 'absolute', left: '50%', opacity: 0})
            .find('p').text($(this).attr('title')).end()
            .find('img').bind('load', function(){
                $(this).parent().animate({left: 0, opacity: 1}).show();
                $(this).parent().parent().animate({height: $(this).parent().height()});
            })
            .attr('src',$(this).attr('rel'));
        
        $(this).parent().children(".selected").removeClass('selected');
        $(this).addClass('selected');
        return false;
    });
    $("#photo-content>a.prev").click(function(){
        var el = $(".media.photo>.selected").prev();
        if( el.length == 0 )
            el = $(".media.photo>a:last-child");
        el.trigger('click');
        return false;
    });
    $("#photo-content>a.next").click(function(){
        var el = $(".media.photo>.selected").next();
        if( el.length == 0 )
            el = $(".media.photo>a:first-child");
        el.trigger('click');
        return false;
    });
    
    $(".media.video>a").click(function(){
        var width = Math.round($(window).width()*.7),
            height = Math.round($(window).height()*.7),
            // width = Math.min(max_width, max_height*),
            // height = Math.min(max_width/1.2, max_height),
            src = $(this).attr('rel');
            
        $('<div class="bubble" id="image-box" style="display: table"><div><div><div> \
            <a class="close" href="#">×</a> \
            <iframe width="'+width+'" height="'+height+'" src="'+src+'" frameborder="0" allowfullscreen></iframe> \
            </div></div></div>').appendTo('body').hide().fadeIn(300)
        .find('a.close').click(function(){
            $(this).parents('.bubble').fadeOut(300, function(){ $(this).remove() });
            $("body").css('overflow','auto');
            return false;
        });
        
        $("body").css('overflow','hidden');
        return false;
    });
    
    $("#photo-content>a.magnifier").click(function(){
        var width = Math.round($(window).width()*.85),
            height = Math.round($(window).height()*.85),
            src = $("#photo-content>div>img").attr('src');
            
        $('<div class="bubble" id="image-box" style="display: table"><div><div><div> \
            <a class="close" href="#">×</a><img src="' + src + '" style="max-width:'+width+'px; max-height:'+height+'px;"/></div></div></div>').appendTo('body').hide().fadeIn(300)
        .find('a.close').click(function(){
            $(this).parents('.bubble').fadeOut(300, function(){ $(this).remove() });
            $("body").css('overflow','auto');
            return false;
        });
        
        $("body").css('overflow','hidden');
        return false;
    });
})