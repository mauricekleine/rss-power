export const Form = ({ children, ...props }) => (
  <form {...props}>{children}</form>
);

export const useSubmit = () => {
  return () => {};
};

export const useTransition = () => {
  return {
    state: "idle",
    submission: {
      formData: new FormData(),
    },
  };
};
