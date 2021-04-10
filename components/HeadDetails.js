import Head from 'next/head';
import PropTypes from 'prop-types'

const HeadDetails = ({title}) => {
    return (  
        <Head lang="en">
            <title>{title}</title>
            <link rel="icon" href="/whatsapp1012-1024.png"/>
        </Head>
    );
}
 
HeadDetails.defaultProps = {
    title : "WhatsApp2.0"
};

HeadDetails.propTypes = {
    title : PropTypes.string
}

export default HeadDetails;