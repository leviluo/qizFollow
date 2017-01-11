import React from 'react';
import {connect} from 'react-redux';
import {hashHistory} from 'react-router'

export function requireAuthentication(Component) {

    class AuthenticatedComponent extends React.Component {

        componentWillMount() {
            this.checkAuth();
        }

        componentWillReceiveProps(nextProps) {
            this.checkAuth();
        }

        checkAuth() {
            if (!this.props.isAuthenticated) {
                console.log(this.props)
                // console.log(this.props.location.pathname)
                // let redirectAfterLogin = this.props.location.pathname;
                // this.props.dispatch(push(null, `/login?next=${redirectAfterLogin}`));
                hashHistory.push('/')
            }
        }

        render() {
            return (
                <div>
                    {this.props.isAuthenticated === true
                        ? <Component {...this.props}/>
                        : null
                    }
                </div>
            )

        }
    }

    const mapStateToProps = (state) => ({
        token: state.auth.token,
        userName: state.auth.userName,
        isAuthenticated: state.auth.isAuthenticated
    });

    return connect(mapStateToProps)(AuthenticatedComponent);

}