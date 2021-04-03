import styled from 'styled-components'
import SearchIcon from '@material-ui/icons/Search';
import {} from '@material-ui/core';

const SearchBar = () => {
    return (  
        <Search>
            <SearchIcon cursor="pointer"/>
            <SearchInput placeholder="Search in Chat"/>
        </Search>
    );
}
 
export default SearchBar;

const Search = styled.div`
    display: flex;
    align-items: center;
    padding : 15px;
    border-radius : 2px;
`;

const SearchInput = styled.input`
outline-width: 0px;
border : none;
flex : 1;
`;

