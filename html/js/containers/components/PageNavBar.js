import React, { Component, PropTypes } from 'react'
export default class PageNavBar extends Component {

    componentDidMount = () => {
        //页面切换过来的刷新
        if (document.getElementById('pagenum'+this.props.currentPage)) {   
                this.SetStyle(this.props.currentPage)
        };
    }

    SetStyle = (currentPage)=>{
        for (var i = 0; i < document.getElementsByName('pagenum').length; i++) {
            document.getElementsByName('pagenum')[i].style.background = '#ccc';
            document.getElementsByName('pagenum')[i].style.color = '#436EEE';
        };
        document.getElementById('pagenum'+currentPage).style.background = '#436EEE';
        document.getElementById('pagenum'+currentPage).style.color = 'white';
    }

    componentDidUpdate =() =>{
        // 更新视图，或者首次加载页面的更新
        if (document.getElementById('pagenum'+this.props.currentPage)) {   
                this.SetStyle(this.props.currentPage)
        };
    }


    render() {
        var items = [];
        let {pageNums,currentPage} = this.props;
        // console.log('Page层:',currentPage,pageNums)
        if (pageNums) {            
            if (pageNums > 4){   //非初始化
                if ((currentPage - 1)>=3) {
                    items.push( < li key = { currentPage-7 } > < a >...< /a></li > );
                    items.push( < li key = { currentPage-2 } > < a name="pagenum" id={'pagenum'+(currentPage-2)} onClick={(e)=>this.props.pagego(e,currentPage-2)}>{currentPage-2}< /a></li > );
                    items.push( < li key = { currentPage-1 } > < a name="pagenum" id={'pagenum'+(currentPage-1)} onClick={(e)=>this.props.pagego(e,currentPage-1)}>{currentPage-1}< /a></li > );
                } else if ((currentPage - 1)>=2) {
                    items.push( < li key = { currentPage-2 } > < a name="pagenum" id={'pagenum'+(currentPage-2)} onClick={(e)=>this.props.pagego(e,currentPage-2)}>{currentPage-2}< /a></li > );
                    items.push( < li key = { currentPage-1 } > < a name="pagenum" id={'pagenum'+(currentPage-1)} onClick={(e)=>this.props.pagego(e,currentPage-1)}>{currentPage-1}< /a></li > );
                } else if ((currentPage - 1)>=1) {
                    items.push( < li key = { currentPage-2 } > < a name="pagenum" id={'pagenum'+(currentPage-1)} onClick={(e)=>this.props.pagego(e,currentPage-1)}>{currentPage-1}< /a></li > );
                }

                items.push( < li key = { currentPage } > < a name="pagenum" id={'pagenum'+(currentPage)} onClick={(e)=>this.props.pagego(e,currentPage)}>{currentPage}< /a></li > );

                if ((pageNums-currentPage)>=3) {
                    items.push( < li key = { currentPage+1 } > < a name="pagenum" id={'pagenum'+(currentPage+1)} onClick={(e)=>this.props.pagego(e,currentPage+1)}>{currentPage+1}< /a></li > );
                    items.push( < li key = { currentPage+2 } > < a name="pagenum" id={'pagenum'+(currentPage+2)} onClick={(e)=>this.props.pagego(e,currentPage+2)}>{currentPage+2}< /a></li > );
                    items.push( < li key = { currentPage+7 } > < a >...< /a></li > );
                } else if ((pageNums-currentPage)>=2) {
                    items.push( < li key = { currentPage+1 } > < a name="pagenum" id={'pagenum'+(currentPage+1)} onClick={(e)=>this.props.pagego(e,currentPage+1)}>{currentPage+1}< /a></li > );
                    items.push( < li key = { currentPage+2 } > < a name="pagenum" id={'pagenum'+(currentPage+2)} onClick={(e)=>this.props.pagego(e,currentPage+2)}>{currentPage+2}< /a></li > );
                } else if ((pageNums-currentPage)>=1) {
                    items.push( < li key = { currentPage+1 } > < a name="pagenum" id={'pagenum'+(currentPage+1)} onClick={(e)=>this.props.pagego(e,currentPage+1)}>{currentPage+1}< /a></li > );
                };

            } else{
                // console.log(pageNums)
                for (var i = 1; i <= pageNums; i++) {
                    items.push( < li key = { i } > < a name="pagenum" id={'pagenum'+(i)} value={i} onClick={this.props.pagego}> { i } < /a></li > );
                };
            }
        };

        const styles = require('./index.scss');
        return ( < ul className = { styles.pagedown } >
            < li > < button className = "btn btn-default" onClick={this.props.firstpage}> 首页 < /button></li >
            < li > < button className = "btn btn-default" onClick={this.props.pageup}> 上一页 < span className = "caret" style = {{ transform: "rotate(180deg)" } } > < /span></button > < /li> 
            { items } 
            < li > < button className = "btn btn-default" onClick={(e)=>this.props.pagedown(e,pageNums)}> 下一页 < span className = "caret" > < /span></button > < /li> 
            < li > < button className = "btn btn-default" onClick={(e)=>this.props.lastpage(e,pageNums)}> 尾页 < /button></li >
            < /ul>
        )
    }
}

PageNavBar.PropTypes = {
    // items: React.PropTypes.array,
    // header: React.PropTypes.string,
}
