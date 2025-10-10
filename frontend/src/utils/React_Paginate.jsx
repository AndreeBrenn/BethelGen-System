import React from "react";
import ReactPaginate from "react-paginate";

const React_Paginate = ({
  itemsPerPage,
  count,
  setItemOffset,
  currentPage,
  setCurrentPage,
}) => {
  const paginated = (value) => {
    const newOffset = (value * itemsPerPage) % count;
    setCurrentPage(value);
    setItemOffset(newOffset);
  };
  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel="Next →"
      onPageChange={(e) => paginated(e.selected)}
      pageRangeDisplayed={3}
      marginPagesDisplayed={1}
      pageCount={Math.ceil(count / itemsPerPage)}
      previousLabel="← Prev"
      renderOnZeroPageCount={null}
      containerClassName="flex items-center justify-center space-x-2 mt-6 text-[0.8rem]"
      pageClassName="group"
      pageLinkClassName="px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors duration-200 group-hover:border-blue-500 group-hover:text-blue-500"
      previousClassName="group"
      previousLinkClassName="px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors duration-200 group-hover:border-blue-500 group-hover:text-blue-500"
      nextClassName="group"
      nextLinkClassName="px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors duration-200 group-hover:border-blue-500 group-hover:text-blue-500"
      breakClassName="text-gray-500 px-3 py-2"
      activeClassName="z-10"
      activeLinkClassName="bg-blue-500 border-blue-500 text-white hover:bg-blue-600"
      disabledClassName="opacity-50 cursor-not-allowed"
      forcePage={currentPage}
    />
  );
};

export default React_Paginate;
