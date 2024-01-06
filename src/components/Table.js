import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortDown, faSortUp, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import Loader from './Loader';

const rowsPerPage = 10;

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

const getBirthDateFromIdCode = (idCode) => {
  const code = idCode.toString();
  const yearCode = code.substring(0, 1);
  let year;
  switch (yearCode) {
    case '1':
    case '2':
      year = '18';
      break;
    case '3':
    case '4':
      year = '19';
      break;
    case '5':
    case '6':
      year = '20';
      break;
    default:
      year = '19';
      break;
  }

  return new Date(year + code.substring(1, 3), code.substring(3, 5), code.substring(5, 7), 0, 0, 0, 0);
};

const formatIdCode = (idCode) => {
  const code = idCode.toString();
  const yearCode = code.substring(0, 1);
  let year;
  switch (yearCode) {
    case '1':
    case '2':
      year = '18';
      break;
    case '3':
    case '4':
      year = '19';
      break;
    case '5':
    case '6':
      year = '20';
      break;
    default:
      year = '19';
      break;
  }

  return code.substring(5, 7) + '.' + code.substring(3, 5) + '.' + year + code.substring(1, 3);
};

const TwnTable = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRow, setSelectedRow] = React.useState(-1);
  const [activePage, setActivePage] = useState(1);
  const [sort, setSort] = useState({ order: 'asc', orderBy: 'id' });
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
      orderBy: prevSort.order === 'desc' && prevSort.orderBy !== 'id' ? 'id' : accessor,
    }));
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
              {activePage >= 3 && <button onClick={() => setActivePage(activePage - 2)}>{activePage - 2}</button>}
              {activePage >= 2 && <button onClick={() => setActivePage(activePage - 1)}>{activePage - 1}</button>}
              <button className={'active'}>{activePage}</button>
              {activePage <= totalPages - 1 && (
                <button onClick={() => setActivePage(activePage + 1)}>{activePage + 1}</button>
              )}
              {activePage <= totalPages - 2 && (
                <button onClick={() => setActivePage(activePage + 2)}>{activePage + 2}</button>
              )}
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
