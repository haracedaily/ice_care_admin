import React from 'react';
import {useMediaQuery} from "react-responsive";
import {Table} from "antd";

function EmployeeTable(props) {
    const isMobile = useMediaQuery({maxWidth: 767});
    console.log(props);
    return isMobile ? (
        <>

        </>
    ):(
      <>
          <Table>

          </Table>
      </>
    );
}

export default EmployeeTable;