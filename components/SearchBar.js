import styled from 'styled-components'
import SearchIcon from '@material-ui/icons/Search';
import {} from '@material-ui/core';

const SearchBar = () => {
    return (  
        <Search>
            <SearchIconStyle style={{fontSize:24}} color="disabled" />
            <SearchInput placeholder="Search in Chat"/>
        </Search>
    );
}
 
export default SearchBar;

const Search = styled.div`
    display: flex;
    align-items: center;
    position: relative;
    padding : 5px;
    border-radius : 2px;
    background-color: #e1eaeb;
`;

const SearchInput = styled.input`
outline-width: 0px;

border-radius : 45px;
border : none;
background-color : white;
font-family: Arial, Helvetica, sans-serif;
padding : 10px;
padding-left : 25px;
flex : 1;
`;

const SearchIconStyle = styled(SearchIcon)`
    cursor:"pointer";
    position:absolute;
`;