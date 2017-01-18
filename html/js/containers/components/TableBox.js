import React, { Component, PropTypes } from 'react'
import PageNavBar from './PageNavBar'

export default class TableBox extends Component{

        state = {
            currentPage:1,
            averagenum:5
        }    

        componentDidUpdate =() =>{//更新搜索条件后页面重新初始化

        }
        componentWillMount =()=>{
            this.setState({
                pageNums: Math.ceil(this.props.data.length/this.state.averagenum)
            })
        }


        componentWillReceiveProps =(nextProps)=>{
            var pageNums = Math.ceil(nextProps.data.length/this.state.averagenum)
            if (this.state.currentPage > pageNums) {
                this.setState({
                    pageNums:pageNums,
                    currentPage:1,
                })
            }else{
                this.setState({
                    pageNums:pageNums
                })
            } 
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

        componentShouldUpdate=(nextProps) =>{
            if (this.props.data == nextProps.data) {
                return false
            }else{
                return true
            }
        }

        chooseOne =(e,index)=>{
            if(e.target.tagName == "BUTTON")return
            if(!this.props.chooseOne)return
            var elem = e.target.parentNode.parentNode.getElementsByTagName('tr')
            for (var i = 0; i < elem.length; i++) {
                elem[i].style.background = "white"
            };
            e.target.parentNode.style.background = "#efefef"
            this.props.chooseOne(e,index)
        }

        render() {
            const averagenum = this.state.averagenum;
            var tableHeader = [];
            for (var i = 0; i < this.props.tableHeader.length; i++) {
                tableHeader.push( < th key={i}> { this.props.tableHeader[i].value } < /th>);
            };
            var items = []; 
            if (this.props.data.id){
                items.push(<tr key="0"><td colSpan={this.props.tableHeader.length} style={{textAling:'center',color:'red'}}>{this.props.data.msg}</td></tr>)
            }
            if (this.props.data.length != 0) {
                for (var i = 0; i < this.props.data.length; i++) {
                    var array = [];
                    ((i)=>{
                        for (var j = 0; j < this.props.tableHeader.length; j++) {
                            if (this.props.tableHeader[j].selectedView) {
                                array.push(<td key = {j} name={i} >{this.props.tableHeader[j].selectedView[this.props.data[i][this.props.tableHeader[j].key]]}</td>);
                                continue;
                            };
                            if (this.props.tableHeader[j].extendsMethod) {
                                array.push(<td key = {j} name={i} >{ this.props.tableHeader[j].extendsMethod(this.props.data[i][this.props.tableHeader[j].key],i) }</td>)
                                continue;
                            }
                            array.push(<td key = {j} name={i} >{ this.props.data[i][this.props.tableHeader[j].key] }</td>)
                        }
                        items.push( < tr key = {i} value = {this.props.data[i].AccountID || this.props.data[i].FuturesID} name={i} style={{cursor:'pointer'}} onClick={(e)=>this.chooseOne(e,i)} onDoubleClick={()=>this.props.modifyModal(i)}>{array}< /tr > );
                    })(i)
                }
            }; 
                // console.log(this.state.pageNums)
                return (<div><table className = "table table-hover" ><thead><tr style={{background:'rgb(240, 248, 255)'}}>{tableHeader}</tr></thead><tbody>{items.slice(averagenum*(this.state.currentPage-1),averagenum*this.state.currentPage)}</tbody></table>
                    {!this.props.PageNavBar && <PageNavBar pagego={this.pagego} firstpage={this.firstpage} lastpage={this.lastpage} pageup={this.pageup} pagedown={this.pagedown} pageNums={this.state.pageNums} currentPage={this.state.currentPage}/>}</div>
                )
            }
}

