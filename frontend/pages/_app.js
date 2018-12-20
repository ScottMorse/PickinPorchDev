import App, { Container } from 'next/app'
import Page from '../components/Page'
import { ApolloProvider } from 'react-apollo'
import { PageTransition } from 'next-page-transitions'
import apolloClient from '../utils/apolloClient'

class MyApp extends App {
    static async getInitialProps({ Component, ctx }){
        let pageProps = {}
        if(Component.getInitialProps){
            pageProps = await Component.getInitialProps(ctx)
        }
        pageProps.query = ctx.query
        pageProps.pathname = ctx.pathname
        return { pageProps }
    }

    render(){
        const { Component, apollo, pageProps } = this.props
        return (
            <Container>
                <ApolloProvider client={apollo}>
                    <Page>
                        <PageTransition timeout={300} classNames="page-transition">
                            <Component {...pageProps}/>
                        </PageTransition>
                    </Page>
                </ApolloProvider>
            </Container>
        )
    }
}

export default apolloClient(MyApp)