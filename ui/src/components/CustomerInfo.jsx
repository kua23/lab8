function CustomerInfo({ customer }) {
  // Format customer name based on whether it's a string or an object
  const formatName = (name) => {
    if (typeof name === 'string') {
      return name;
    }
    return `${name.firstName} ${name.middleName ? name.middleName + ' ' : ''}${name.lastName}`.trim();
  };

  return (
    <div className="customer-info">
      <h2>Customer Name: {formatName(customer.name)}</h2>
      {/* other customer information */}
    </div>
  );
}

export default CustomerInfo;
