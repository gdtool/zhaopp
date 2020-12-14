(function($,$w){
    function getQueryVariable(variable)
    {
           var query = window.location.search.substring(1);
           var vars = query.split("&");
           for (var i=0;i<vars.length;i++) {
                   var pair = vars[i].split("=");
                   if(pair[0] == variable){return pair[1];}
           }
           return('');
    }
    var CONTAINER_ID = 'jsmind_container';

    var $d = $w.document;
    var $container = $d.getElementById(CONTAINER_ID);

    var _h_header = $d.getElementsByTagName('nav')[0].clientHeight;
    var options = {
            container:CONTAINER_ID,
            editable:true,
            theme:'asphalt',
            shortcut:{
                   enable:true,        // 是否启用快捷键
                   handles:{},         // 命名的快捷键事件处理器
                   mapping:{           // 快捷键映射
                       addchild   : 9,    // <tab>
                       addbrother : 13,    // <Enter>
                       editnode   : 113,   // <F2>
                       delnode    : 46,    // <Delete>
                       toggle     : 32,    // <Space>
                       left       : 37,    // <Left>
                       up         : 38,    // <Up>
                       right      : 39,    // <Right>
                       down       : 40,    // <Down>
                   }
               },
            menuOpts:{
              showMenu: true,
              injectionList: [
                  {target:'edit',text: '编辑节点'}, 
                  {target:'addChild',text: '添加子节点'},
                  {target:'addBrother',text: '添加同级节点'},
                  {target:'openURL',text: '打开超链接'},
              ],
            }
    };
    var _jm = new jsMind(options);

    var get_mind_id = function(){
        return getQueryVariable('mindid');
        //return location.href.match(/([a-zA-Z0-9]{32})(#.*)?$/)[1];
    };

    var get_mind_url = function(){
        var mindid=getQueryVariable('mindid');
        var ver=getQueryVariable('ver');
        return "./api/getmind.php?mindid="+mindid+"&ver="+ver;
    };
    var delete_mind_url = function(){
        var mindid=getQueryVariable('mindid');
        var ver=getQueryVariable('ver');
        return "./api/deletemind.php?mindid="+mindid+"&ver="+ver;
    };
   var save_mind_url = function(){
        var mindid=getQueryVariable('mindid');
        var ver=getQueryVariable('ver');
        return "./api/savemind.php?mindid="+mindid+"&ver="+ver;
    };
    var load_ajax_mind = function(url){
        jsMind.util.ajax.get(url,function(mind){
            _jm.show(mind);
        });
    };

    var on_mind_saved = function(data){
        if(data.success){
            $('#save_map_btn').popover({
                delay: {'hide': 2000},
                content: '保存成功',
                placement: 'bottom',
                trigger: 'focus',
                container: 'body'
            }).popover('show');
            
            var url="mind.php?mindid="+getQueryVariable('mindid');
            window.open(url,"_self");

        }
        else{
            $('#save_map_btn').popover({
                delay: {'hide': 500},
                content: "失败--:"+data.message,
                placement: 'bottom',
                trigger: 'focus',
                container: 'body'
            }).popover('show');
        }
    };

    var on_mind_name_changed = function(data){
        if(data.success){
            var mind_name = $('#mind_name_input').val();
            $('#mind_name_link').text(mind_name);
        }
        else{
            alert("重命名失败:" + data.messege);
            
        }
        toggle_edit_mind_name();
    };

    var on_mind_deleted = function(data){
        if(data.success){
            // back_to_list();
            var url="mind.php?mindid="+getQueryVariable('mindid');
            // window.open(url,"_self");
            location.href=url;
        }
    };

    var toggle_edit_mind_name = function(e){
        $('#mind_name_link, #mind_name_edit_panel').toggleClass('hidden');
        return false;
    };


    var change_mind_name = function(e){
        var mind_id = get_mind_id();
        var origin_mind_name = $('#mind_name_link').text();
        var mind_name = $('#mind_name_input').val();
        if(origin_mind_name == mind_name){
            toggle_edit_mind_name();
            return false;
        }
        $.ajax({
            url : '/api/rename.php',
            type : 'POST',
            data: {"mindid":mind_id,"mindname":mind_name},
            success : on_mind_name_changed
        });
        return false;
    };

    var save_map = function(e){
        $.ajax({
            url  : save_mind_url(),
            type : 'POST',
            data: JSON.stringify(_jm.get_data()),
            contentType: "application/json; charset=utf-8",
            dataType   : "json",
            success : on_mind_saved
        });
        return false;
    };

    var add_sibling_node = function(e){
        _jm.shortcut.handles['addbrother'](_jm, e);
        return false;
    };
    var edit_node = function(e){
        _jm.shortcut.handles['editnode'](_jm, e);
        return false;
    };
    var add_child_node = function(e){
        _jm.shortcut.handles['addchild'](_jm, e);
        return false;
    };
    function save_file(){
        var mind_data = _jm.get_data();
        var mind_name = mind_data.meta.name;
        var mind_str = jsMind.util.json.json2string(mind_data);
        jsMind.util.file.save(mind_str,'text/jsmind',mind_name+'.jm');
    }
    // var remove_node = function(e){
    //     _jm.shortcut.handles['delnode'](_jm, e);
    //     return false;
    // };
    function remove_node(){
        var selected_id = get_selected_nodeid();
        if(!selected_id){prompt_info('please select a node first.');return;}

        _jm.remove_node(selected_id);
    }
    function get_selected_nodeid(){
        var selected_node = _jm.get_selected_node();
        if(!!selected_node){
            return selected_node.id;
        }else{
            return null;
        }
    }

    function change_color_text_hong(){
        var selected_id = get_selected_nodeid();
        if(!selected_id){return;}

        _jm.set_node_color(selected_id, null, "#F00");
    }
    function change_color_text_lv(){
        var selected_id = get_selected_nodeid();
        if(!selected_id){return;}

        _jm.set_node_color(selected_id, null, "#0F0");
    }
    function change_color_text_lan(){
        var selected_id = get_selected_nodeid();
        if(!selected_id){return;}

        _jm.set_node_color(selected_id, null, "#00F");
    }
    function change_color_text_hei(){
        var selected_id = get_selected_nodeid();
        if(!selected_id){return;}

        _jm.set_node_color(selected_id, null, "#000");
    }
    function change_color_text_bai(){
        var selected_id = get_selected_nodeid();
        if(!selected_id){return;}

        _jm.set_node_color(selected_id, null, "#FFF");
    }


    function change_color_bg_hong(){
        var selected_id = get_selected_nodeid();
        if(!selected_id){return;}

        _jm.set_node_color(selected_id, "#F00", null);
    }
    function change_color_bg_lv(){
        var selected_id = get_selected_nodeid();
        if(!selected_id){return;}

        _jm.set_node_color(selected_id, "#0F0", null);
    }
    function change_color_bg_lan(){
        var selected_id = get_selected_nodeid();
        if(!selected_id){return;}

        _jm.set_node_color(selected_id, "#00F", null);
    }
    function change_color_bg_hei(){
        var selected_id = get_selected_nodeid();
        if(!selected_id){return;}

        _jm.set_node_color(selected_id, "#000", null);
    }
    function change_color_bg_bai(){
        var selected_id = get_selected_nodeid();
        if(!selected_id){return;}

        _jm.set_node_color(selected_id, "#FFF", null);
    }
    function change_color_null(){
        var selected_id = get_selected_nodeid();
        if(!selected_id){return;}

        _jm.set_node_color(selected_id, null, null);
    }    
    var clear_map = function(e){
        curr_mind = _jm.mind;
        _jm.show();
        _jm.mind.author = curr_mind.author;
        _jm.begin_edit(_jm.mind.root);
        return false;
    };

    var destory_map = function(e){
      if(confirm("确实要删除吗？")){
        $.ajax({
            url  : delete_mind_url(),
            type : 'POST',
            contentType: "application/json; charset=utf-8",
            dataType   : "json",
            success : on_mind_deleted
        });
        return false;
      }

    };

    var back_to_list = function(e){
        location.href='/list.php';
        return false;
    };

    var set_container_size = function(){
        var ch = $w.innerHeight-_h_header;
        var cw = $w.innerWidth;
        $container.style.height = ch+'px';
        $container.style.width = cw+'px';
    };

    var _resize_timeout_id = -1;
    var reset_container_size = function(){
        if(_resize_timeout_id != -1){
            clearTimeout(_resize_timeout_id);
        }
        _resize_timeout_id = setTimeout(function(){
            _resize_timeout_id = -1;
            set_container_size();
            _jm.resize();
        },300);
    };

    var register_event = function(){
        jsMind.util.dom.add_event($w,'resize',reset_container_size);
    };

    var init_action_menu = function(){
        $('#mind_name_link').click(toggle_edit_mind_name);
        $('#change_mind_name_btn').click(change_mind_name);
        $('#save_map_btn').click(save_map);
        $('#add_sibling_node_btn').click(add_sibling_node);
        $('#edit_node_btn').click(edit_node);
        $('#add_child_node_btn').click(add_child_node);
        $('#remove_node_btn').click(remove_node);
        $('#clear_map_btn').click(clear_map);
        $('#destory_map_btn').click(destory_map);
        $('#back_to_list_btn').click(back_to_list);
        
        $('#change_color_text_hong_btn').click(change_color_text_hong);
        $('#change_color_text_lv_btn').click(change_color_text_lv);
        $('#change_color_text_lan_btn').click(change_color_text_lan);
        $('#change_color_text_bai_btn').click(change_color_text_bai);
        $('#change_color_text_hei_btn').click(change_color_text_hei);
        
        $('#change_color_bg_hong_btn').click(change_color_bg_hong);
        $('#change_color_bg_lv_btn').click(change_color_bg_lv);
        $('#change_color_bg_lan_btn').click(change_color_bg_lan);
        $('#change_color_bg_bai_btn').click(change_color_bg_bai);
        $('#change_color_bg_hei_btn').click(change_color_bg_hei);
        $('#change_color_null_btn').click(change_color_null);


        $('#save_file_btn').click(save_file);
        $('#add_sibling_node_btn0').click(add_sibling_node);
        $('#edit_node_btn0').click(edit_node);
        $('#add_child_node_btn0').click(add_child_node);
        $('#remove_node_btn0').click(remove_node);
        $('#change_color_text_hong_btn0').click(change_color_text_hong);
        $('#change_color_bg_hong_btn0').click(change_color_bg_hong);
        $('#change_color_null_btn0').click(change_color_null);
    };

    var page_load = function(){
        register_event();
        set_container_size();
        load_ajax_mind(get_mind_url());
        init_action_menu();
    };

    page_load();
})(jQuery,window);
