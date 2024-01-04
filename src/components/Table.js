import React, { useState, useEffect, useMemo } from "react";
import data from '../components/tableData';
import { Link } from "react-router-dom";
import { isNil, convertType, isNumber } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort, faSortDown, faSortUp, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

const tableData = data;

function TwnTable() {
    // const [data, setData] = useState([]);

    // useEffect(() => {
    //     fetch("https://midaiganes.irw.ee/api/list?limit=500")
    //     .then(response => response.json())
    //     .then(data => setData(data["lists"]))
    //     .then(() => console.log(data))
    // }, [])
    const [selectedRow, setSelectedRow] = React.useState(-1);

    function formatIdCode(idCode) {
        const code = idCode.toString();
        const yearCode = code.substring(0, 1);
        let year;
        switch (yearCode) {
            case "1":
            case "2":
                year = "18";
                break;
            case "3":
            case "4":
                year = "19"
                break;
            case "5":
            case "6":
                year = "20"
                break;
            default:
                year = "19"
                break;
        }

        return code.substring(5, 7) + "." + code.substring(3, 5) + "." + year + code.substring(1, 3);
    }

    const columns = [
        { accessor: 'firstname', label: 'Eesnimi' },
        { accessor: 'surname', label: 'Perenimi' },
        { accessor: 'sex', label: 'Sugu', format: value => (value === "f" ? "Naine" : "Mees") },
        { accessor: 'personal_code', label: 'Sünnikuupäev', format: value => (formatIdCode(value)) },
        { accessor: 'phone', label: 'Telefon', format: value => (value.substring(0, 4) + ' ' + value.substring(4)) },
    ]

    const rows = tableData.list.map((row, index) => {
        return (
            <>
                <tr key={row.id}
                    onClick={() => selectedRow !== index ? setSelectedRow(index) : setSelectedRow(-1)}
                    className={selectedRow === index ? 'open' : ''}>
                    {columns.map(column => {
                        if (column.format) {
                            return <td key={column.accessor}>{column.format(row[column.accessor])}</td>
                        }
                        return <td key={column.accessor}>{row[column.accessor]}</td>
                    })}
                </tr>
                <tr key={index} className="inner-tr">
                    <td colSpan={5}>
                        <div className="table-inner">
                            <div className="table-image" style={{ backgroundImage: `url(${row.image.small})` }}></div>
                            <div>
                                <div dangerouslySetInnerHTML={{ __html: row.intro }}></div>
                                <div>
                                    <Link to={`/article/${row.id}`}><button role="link" className="btn-green">Loe rohkem</button></Link>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            </>
        )
    });

    const [activePage, setActivePage] = useState(1);
    const rowsPerPage = 10;
    const count = rows.length;
    const totalPages = Math.ceil(count / rowsPerPage);
    const calculatedRows = rows.slice((activePage - 1) * rowsPerPage, activePage * rowsPerPage);
    const [sort, setSort] = useState({ order: 'asc', orderBy: 'id' })

    function sortRows(rows, sort) {
        return rows.sort((a, b) => {
            const { order, orderBy } = sort

            if (isNil(a[orderBy])) return 1
            if (isNil(b[orderBy])) return -1

            const aLocale = convertType(a[orderBy])
            const bLocale = convertType(b[orderBy])

            if (order === 'asc') {
                return aLocale.localeCompare(bLocale, 'en', { numeric: isNumber(b[orderBy]) })
            } else {
                return bLocale.localeCompare(aLocale, 'en', { numeric: isNumber(a[orderBy]) })
            }
        })
    }

    const handleSort = accessor => {
        setActivePage(1)
        setSort(prevSort => ({
            order: prevSort.order === 'asc' && prevSort.orderBy === accessor ? 'desc' : 'asc',
            orderBy: accessor,
        }))
    }

    const sortedRows = useMemo(() => sortRows(calculatedRows, sort), [calculatedRows, sort])

    return (
        <div className="wrapper">
            <div className="table-wrap">
                <h1 className="title">Nimekiri</h1>
                <table>
                    <thead>
                        <tr>
                            {columns.map(column => {
                                const sortIcon = () => {
                                    if (column.accessor === sort.orderBy) {
                                        if (sort.order === 'asc') {
                                            return <FontAwesomeIcon icon={faSortUp} />
                                        }
                                        return <FontAwesomeIcon icon={faSortDown} />
                                    } else {
                                        return <FontAwesomeIcon icon={faSort} />
                                    }
                                }

                                return (
                                    <th key={column.accessor}>
                                        <button onClick={() => handleSort(column.accessor)}><span>{column.label}</span> {sortIcon()}</button>
                                    </th>
                                )
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedRows}
                    </tbody>
                </table>

                <div className="pagination">
                    <button disabled={activePage === 1} onClick={() => setActivePage(activePage - 1)}><FontAwesomeIcon icon={faChevronLeft} /></button>
                    {activePage >= 3 && <button onClick={() => setActivePage(activePage - 2)}>{activePage - 2}</button>}
                    {activePage >= 2 && <button onClick={() => setActivePage(activePage - 1)}>{activePage - 1}</button>}
                    <button className={"active"}>{activePage}</button>
                    {activePage <= totalPages - 1 && <button onClick={() => setActivePage(activePage + 1)}>{activePage + 1}</button>}
                    {activePage <= totalPages - 2 && <button onClick={() => setActivePage(activePage + 2)}>{activePage + 2}</button>}
                    <button disabled={activePage === totalPages} onClick={() => setActivePage(activePage + 1)}><FontAwesomeIcon icon={faChevronRight} /></button>
                </div>

            </div>
        </div>
    )
}

export default TwnTable;