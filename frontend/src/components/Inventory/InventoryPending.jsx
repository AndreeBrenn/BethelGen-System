import { useState, useEffect } from "react";
import usePrivateAxios from "../../hooks/useProtectedAxios";

const InventoryPending = ({ user }) => {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);

  const axiosPrivate = usePrivateAxios();

  const fetchPendingItems = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axiosPrivate.get(
        `/inventory/pending-for-me?page=${page}&limit=${pagination.limit}`
      );

      console.log(response);

      setItems(response.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error fetching pending items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingItems(1);
  }, []);

  const handlePageChange = (newPage) => {
    fetchPendingItems(newPage);
  };

  // Your existing allowedButtons logic for individual items
  const allowedButtons = (itemData) => {
    const terminalStatuses = ["Shipped", "Received", "Rejected"];
    if (terminalStatuses.includes(itemData.Item_status)) return false;
    if (!itemData.Item_signatories) return true;

    const orderCount = itemData.Item_signatories.filter(
      (fil) => fil.Status === "Approved"
    );

    const userApprover = itemData.Item_signatories.find(
      (fil) => fil.ID === user.ID
    );

    if (
      userApprover &&
      userApprover.Order === orderCount.length &&
      userApprover.Status !== "Approved"
    ) {
      return true;
    }

    return false;
  };

  //   <div className="header">
  //         <h2>Pending Items - Your Turn to Sign</h2>
  //         <span className="badge">{pagination.total}</span>
  //       </div>

  //       {loading ? (
  //         <div className="loading">Loading...</div>
  //       ) : items.length === 0 ? (
  //         <div className="empty-state">
  //           <p>No pending items requiring your signature</p>
  //         </div>
  //       ) : (
  //         <>
  //           <div className="items-list">
  //             {items.map((item) => (
  //               <div key={item.id} className="item-card">
  //                 <div className="item-header">
  //                   <h3>{item.Item_name}</h3>
  //                   <span className="status-badge pending">Your Turn</span>
  //                 </div>

  //                 <div className="item-details">
  //                   <p>Status: {item.Item_status}</p>

  //                   {/* Show signatory progress */}
  //                   <div className="signatory-progress">
  //                     {item.Item_signatories?.map((sig, idx) => (
  //                       <div
  //                         key={sig.ID}
  //                         className={`signatory ${
  //                           sig.Status === "Approved"
  //                             ? "approved"
  //                             : sig.ID === user.ID
  //                             ? "current"
  //                             : "pending"
  //                         }`}
  //                       >
  //                         <span className="order">{sig.Order + 1}</span>
  //                         <span className="name">{sig.Name}</span>
  //                         <span className="status">{sig.Status}</span>
  //                       </div>
  //                     ))}
  //                   </div>
  //                 </div>

  //                 {allowedButtons(item) && (
  //                   <div className="actions">
  //                     <button
  //                       className="btn-approve"
  //                       onClick={() => handleApprove(item.id)}
  //                     >
  //                       Approve
  //                     </button>
  //                     <button
  //                       className="btn-reject"
  //                       onClick={() => handleReject(item.id)}
  //                     >
  //                       Reject
  //                     </button>
  //                   </div>
  //                 )}
  //               </div>
  //             ))}
  //           </div>

  //           {/* Pagination */}
  //           <div className="pagination">
  //             <button
  //               disabled={pagination.page === 1 || loading}
  //               onClick={() => handlePageChange(pagination.page - 1)}
  //             >
  //               Previous
  //             </button>

  //             <span className="page-info">
  //               Page {pagination.page} of {pagination.totalPages}
  //               <small> ({pagination.total} total items)</small>
  //             </span>

  //             <button
  //               disabled={pagination.page === pagination.totalPages || loading}
  //               onClick={() => handlePageChange(pagination.page + 1)}
  //             >
  //               Next
  //             </button>
  //           </div>
  //         </>
  //       )}

  return <div className="pending-tab"></div>;
};

export default InventoryPending;
