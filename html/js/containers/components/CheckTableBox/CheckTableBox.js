import React, { Component, PropTypes } from 'react'
import PageNavBar from '../PageNavBar'

export default class CheckTableBox extends Component{

        state = {
            currentPage:1,
            averagenum:10,
            chooseItems:[]
        }    

        pageup = (e)=>{
            if (this.state.currentPage == 1) {return};
            this.setState({
                currentPage:this.state.currentPage == 1 ? 1 : this.state.currentPage - 1
            })
        }

        pagedown = (e,pageNums)=>{
            if (this.state.currentPage == pageNums) {return};
            this.setState({
                currentPage:this.state.currentPage == pageNums ? pageNums : this.state.currentPage + 1
            })
        }

        firstpage = () =>{
            if (this.state.currentPage == 1) {return};
            this.setState({
                currentPage:1
            })
        }

        lastpage = (e,pageNums) =>{
            if (this.state.currentPage == pageNums) {return};
            this.setState({
                currentPage:pageNums
            })
        }

        pagego = (e,currentPage) =>{
            if (this.state.currentPage == currentPage) {return};
            this.setState({
                currentPage:currentPage == undefined ? e.target.getAttribute("value") : currentPage
            })
        }

        showButton = (e,id)=>{

            this.setState({
                isShowButton:id
            })
        }

        hiddenButton = (e,id)=>{
            this.setState({
                isShowButton:undefined
            })
        }

        deleteMulti = (e) =>{
          console.log(this.state.chooseItems)
        }

        setStyle = (directive,id) =>{
          if (directive=='on') {
            var color = '#efefef'
            var flag = true;
          }else if(directive=='off'){
            var color = '#fff'
            var flag = false;
          }
          var items = document.getElementsByName('select')
          for (var i = 0; i < items.length; i++) {
            items[i].checked = flag
            items[i].parentNode.parentNode.style.background = color
          };
          if (id>=0) {
            items[id].checked = true;
            items[id].parentNode.parentNode.style.background = '#efefef'
          };
        }

        chooseOne = (e,id)=>{
            this.setStyle('off',id-(this.state.currentPage-1)*this.state.averagenum)
            this.setState({
              chooseItems:[id]
            })
        }

        chooseMulti =(e,id)=>{
          var items = this.state.chooseItems;
          if (!e.target.checked) {
            e.target.parentNode.parentNode.style.background = '#fff'
            for (var i = 0; i < this.state.chooseItems.length; i++) {
              if(this.state.chooseItems[i] == id){
                items.splice(i,1)
                break
              }
            };
          }else{
            e.target.parentNode.parentNode.style.background = '#efefef'
            items.push(id);
          }

            this.setState({
                chooseItems:items
            })
          e.stopPropagation()
        }

        chooseAll = (e)=>{
          if(e.target.checked){
            this.setStyle('on')
            var ar = []
            for (var i = 0; i < Math.min(this.state.averagenum,this.props.data.length); i++) {
                ar.push(i)
            };
            this.setState({
              chooseItems:ar
            })
          }else{
            this.setStyle('off')
            this.setState({
              chooseItems:[]
            })
          }
        }

        render() {
            const {tableHeader,data} = this.props
            var headerItems = [< th key="0" style={{width:'15%'}}><input type="checkbox" onClick={this.chooseAll}/>全选</th>];
            for (var i = 0; i < tableHeader.length; i++) {
                headerItems.push( < th key={i+1} style={{width:tableHeader[i].width}}> { tableHeader[i].value } < /th>);
            };
            var items = []; 
            //判断是否空数据
            if (data.id){
                items.push(<tr key="0"><td colSpan={tableHeader.length+1} style={{color:'red'}}>{data.msg}</td></tr>)
            }
            //判断是否空数据
            if (data.length != 0) {
                for (var i = 0; i < data.length; i++) {
                    ((i)=>{
                          var tds = [];
                          for (var j = 0; j < tableHeader.length; j++) {

                            if (tableHeader[j].selectedView) {
                                tds.push(<td key = {j+1} >{tableHeader[j].selectedView[data[i][tableHeader[j].key]]}</td>);
                                continue;
                            };

                            if (tableHeader[j].extendsMethod) {
                                tds.push(<td key = {j+1} >{ tableHeader[j].extendsMethod(data[i][tableHeader[j].key],i) }</td>)
                                continue;
                            }
                                tds.push(<td key={j+1}>{data[i][tableHeader[j].key]}</td>)
                            };

                            tds.unshift(<td key="0"><input type="checkbox" name="select" onClick={(e)=>this.chooseMulti(e,i)}/></td>)
                            items.push(<tr key={i} onMouseOver={(e)=>this.showButton(e,i)} onMouseLeave={this.hiddenButton} onClick={(e)=>this.chooseOne(e,i)}>{tds}</tr>)
                    })(i)
                };
            };  

            let currentPage = this.state.currentPage;
            let pageNums = Math.ceil(items.length/this.state.averagenum);
            // console.log(this.props.data)
            return (<span><div className="btn-group pull-right" >
            {this.props.add && <button className="btn btn-primary" style={{margin:'10px 0'}} onClick={(e)=>this.props.add(e,this.state.chooseItems)}>{this.props.addHeader}</button>}
            {this.props.batchdelete && <button className="btn btn-primary" style={{margin:'10px 0'}} onClick={(e)=>this.props.batchdelete(e,this.state.chooseItems)}>{this.props.batchdeleteHeader}</button>}
            {this.props.batchModify && <button className="btn btn-primary" style={{margin:'10px 0'}} onClick={(e)=>this.props.batchModify(e,this.state.chooseItems)}>{this.props.batchModifyHeader}</button>}
            </div><table className = "table table-hover" ><thead><tr style={{background:'#F0F8FF'}}>{headerItems}</tr></thead><tbody>{items.slice(this.state.averagenum*(currentPage-1),this.state.averagenum*currentPage)}</tbody></table>
                {!this.props.PageNavBar && <PageNavBar pagego={this.pagego} firstpage={this.firstpage} lastpage={this.lastpage} pageup={this.pageup} pagedown={this.pagedown} pageNums={pageNums} currentPage={currentPage}/>}</span>
                )
            }
}

