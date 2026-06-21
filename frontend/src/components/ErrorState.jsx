const ErrorState = ({ message = "Something went wrong." }) => (
  <div className="rounded-lg border border-rust/20 bg-rust/10 p-5 text-sm font-bold text-rust">{message}</div>
);

export default ErrorState;
