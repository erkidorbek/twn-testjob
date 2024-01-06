import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortDown, faSortUp, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { getBirthDateFromIdCode, formatIdCode } from '../components/helperFunctions';
import Loader from './Loader';

const columns = [
  { accessor: 'firstname', label: 'Eesnimi', sortable: true },
  { accessor: 'surname', label: 'Perenimi', sortable: true },
  {
    accessor: 'sex',
    label: 'Sugu',
    sortable: true,
    format: (value) => (value === 'f' ? 'Naine' : 'Mees'),
  },
  {
    accessor: 'personal_code',
    label: 'Sünnikuupäev',
    sortable: true,
    format: (value) => formatIdCode(value),
  },
  {
    accessor: 'phone',
    label: 'Telefon',
    format: (value) => value.substring(0, 4) + ' ' + value.substring(4),
  },
];

const TwnTable = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRow, setSelectedRow] = React.useState(-1);
  const [activePage, setActivePage] = useState(1);
  const [sort, setSort] = useState({ order: 'asc', orderBy: 'index' });
  const rowsPerPage = 10;
  const totalPages = Math.ceil(data?.list?.length / rowsPerPage);

  useEffect(() => {
    fetch('https://midaiganes.irw.ee/api/list?limit=500')
      .then((response) => response.json())
      .then((data) => setData(data))
      .then(() => setIsLoading(false));
  }, []);

  const rows = useMemo(
    () =>
      data?.list
        ?.map((row, index) => ({ index, ...row }))
        ?.sort((a, b) => {
          const { order, orderBy } = sort;

          if (orderBy === 'personal_code') {
            const dateA = getBirthDateFromIdCode(a.personal_code).getTime();
            const dateB = getBirthDateFromIdCode(b.personal_code).getTime();

            if (order === 'asc') {
              return dateA > dateB ? 1 : -1;
            } else {
              return dateB > dateA ? 1 : -1;
            }
          }

          if (order === 'asc') {
            return String(a[orderBy])?.localeCompare(String(b[orderBy]), 'et') || 1;
          } else {
            return String(b[orderBy])?.localeCompare(String(a[orderBy]), 'et') || -1;
          }
        })
        .slice((activePage - 1) * rowsPerPage, activePage * rowsPerPage),
    [data, activePage, sort]
  );

  const handleSort = (accessor) => {
    setActivePage(1);
    setSort((prevSort) => ({
      order: prevSort.order === 'asc' && prevSort.orderBy === accessor ? 'desc' : 'asc',
      orderBy: prevSort.order === 'desc' && prevSort.orderBy === accessor ? 'index' : accessor,
    }));
  };

  const getRange = (start, end, activePage) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, i) => (
      <button className={activePage === start + i ? 'active' : ''} onClick={() => setActivePage(start + i)}>
        {start + i}
      </button>
    ));
  };

  const paginationNumbers = (currentPage, pageCount, delta) => {
    const pages = [];

    if (currentPage <= delta) {
      pages.push(...getRange(1, Math.min(pageCount, delta * 2 + 1), currentPage));
    } else if (currentPage > pageCount - delta) {
      pages.push(...getRange(Math.max(1, pageCount - delta * 2), pageCount, currentPage));
    } else {
      pages.push(...getRange(Math.max(1, currentPage - delta), Math.min(pageCount, currentPage + delta), currentPage));
    }

    return pages;
  };

  return (
    <div className="wrapper">
      <div className="table-wrap">
        <h1 className="title">Nimekiri</h1>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  {columns.map((column) => {
                    const sortIcon = () => {
                      if (column.accessor === sort.orderBy) {
                        if (sort.order === 'asc') {
                          return <FontAwesomeIcon icon={faSortUp} />;
                        }
                        return <FontAwesomeIcon icon={faSortDown} />;
                      } else {
                        return <FontAwesomeIcon icon={faSort} />;
                      }
                    };

                    return (
                      <th key={column.accessor}>
                        {column.sortable ? (
                          <button onClick={() => handleSort(column.accessor)}>
                            <span>{column.label}</span> {sortIcon()}
                          </button>
                        ) : (
                          <span>{column.label}</span>
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <>
                    <tr
                      key={`${row.id}-content`}
                      onClick={() => (selectedRow !== index ? setSelectedRow(index) : setSelectedRow(-1))}
                      className={selectedRow === index ? 'open' : ''}
                    >
                      {columns.map((column) => {
                        if (column.format) {
                          return <td key={column.accessor}>{column.format(row[column.accessor])}</td>;
                        }
                        return <td key={column.accessor}>{row[column.accessor]}</td>;
                      })}
                    </tr>
                    <tr key={`${row.id}-hidden`} className="inner-tr">
                      <td colSpan={5}>
                        <div className="table-inner">
                          <div
                            className="table-image"
                            style={{
                              backgroundImage: `url(${row.image.small})`,
                            }}
                          />
                          <div>
                            <div dangerouslySetInnerHTML={{ __html: row.intro }}></div>
                            <div>
                              <Link to={`/article/${row.id}`}>
                                <button role="link" className="btn-green">
                                  Loe rohkem
                                </button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>

            <div className="pagination">
              <button disabled={activePage === 1} onClick={() => setActivePage(activePage - 1)}>
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              {paginationNumbers(activePage, totalPages, 2)}
              <button disabled={activePage === totalPages} onClick={() => setActivePage(activePage + 1)}>
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TwnTable;
