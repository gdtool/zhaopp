(function($w){
    var CONTAINER_ID = 'jsmind_container';
    var $container = $w.document.getElementById(CONTAINER_ID);
   var options = {
            container:CONTAINER_ID,
            editable:true,
            theme:'primary',
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

    var page_load = function(){
        set_container_size();
        jsMind.util.dom.add_event($w,'resize',reset_container_size);
        jsMind.util.ajax.get('/static/files/trial.jm',function(mind){
            _jm.show(mind);
        });
    };

    var set_container_size = function(){
        var cw = $w.innerWidth-40;
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

    page_load();
})(window);
