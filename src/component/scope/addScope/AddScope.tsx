import { useEffect } from "react";
import { Drawer, Input, Button, Form, App } from "antd";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setLoading, setError, clearError } from "../../../store/scope/scopeSlice";
import { createTopic, ITopic } from "../../../services/vdrAgent";
import "./AddScope.scss";

interface AddScopeProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (topic: ITopic) => void;
}

interface ScopeFormValues {
  scopeName: string;
  instruction?: string;
}

const AddScope = ({ open, onClose, onSuccess }: AddScopeProps) => {
  const { message } = App.useApp();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.scope);
  const projectId = useAppSelector((state) => state.app.selectedProjectId);
  const [form] = Form.useForm<ScopeFormValues>();
  const scopeName = Form.useWatch("scopeName", form);
  const instruction = Form.useWatch("instruction", form);

  // Check if required field is valid (not empty and meets minimum length)
  const isFormValid = scopeName && scopeName.trim().length >= 4
    && instruction && instruction.trim().length > 0;

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      dispatch(clearError());
      dispatch(setLoading(true));

      if (!projectId) {
        dispatch(setError("No project selected."));
        dispatch(setLoading(false));
        return;
      }

      const topic = await createTopic(projectId, values.scopeName, values.instruction);

      if (!topic) {
        dispatch(setError("Failed to add scope. Please try again."));
        dispatch(setLoading(false));
        return;
      }

      message.success("Scope added successfully!");
      form.resetFields();
      dispatch(setLoading(false));
      onSuccess?.(topic);
      onClose();
    } catch (error) {
      console.error("Validation failed:", error);
      dispatch(setLoading(false));
      dispatch(setError("Failed to add scope. Please try again."));
    }
  };

  const handleClose = () => {
    form.resetFields();
    dispatch(clearError());
    dispatch(setLoading(false));
    onClose();
  };

  // Show error message if there's an error
  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  return (
    <Drawer
      placement="right"
      size={480}
      open={open}
      onClose={handleClose}
      closeIcon={<i className="erm-icon close-icon" />}
      className="add-scope-drawer"
      title={
        <div className="drawer-header">
          <h3 className="drawer-title">Add New Scope</h3>
          <p className="drawer-subtitle">
            Define a new scope category to organize requests and documents.
          </p>
        </div>
      }
      footer={
        <div className="drawer-footer">
          <Button onClick={handleClose} shape="round" type="text">
            Cancel
          </Button>
          <Button
            type="primary"
            className="primary-btn"
            shape="round"
            onClick={handleSubmit}
            disabled={!isFormValid || isLoading}
            loading={isLoading}>
            ADD SCOPE
          </Button>
        </div>
      }>
      <Form
        form={form}
        layout="vertical"
        className="add-scope-form">
        <Form.Item
          name="scopeName"
          label={
            <span>
              Scope Name <span className="required">*</span>
            </span>
          }
          required={false}
          rules={[
            { required: true, message: "Please enter scope name" },
            { min: 4, message: "Scope name must be at least 4 characters" },
            { max: 100, message: "Scope name must not exceed 100 characters" },
          ]}>
          <Input
            className="input-field"
            placeholder="e.g. Water Management, Human Rights, Supply Chain Ethics"
          />
        </Form.Item>

        <Form.Item
          name="instruction"
          label={
            <span>
              Instruction <span className="required">*</span>
            </span>
          }
          required={false}
          rules={[
            { required: true, message: "Please enter an instruction" },
            { max: 500, message: "Instruction must not exceed 500 characters" },
          ]}>
          <Input.TextArea
            className="textarea"
            rows={3}
            maxLength={500}
            placeholder="Provide instructions for this scope."
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default AddScope;
