import { Drawer, Input, Button, Form } from "antd";
import { IMAGES } from "../../shared";
import "./AddScopeDrawer.scss";
interface AddScopeDrawerProps {
  open: boolean;
  onClose: () => void;
  onAdd?: (description: string) => void;
}

const AddScopeDrawer = ({ open, onClose }: AddScopeDrawerProps) => {
  const handleAdd = () => {
    onClose();
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      placement="right"
      width={480}
      closable={true}
      className="add-scope-drawer add-flag-drawer"
      closeIcon={<i className="erm-icon close-icon" />}
      title={
        <div className="drawer-header">
          <h3 className="drawer-title">
            <div className="header-icon">
              <img src={IMAGES.addFlagIcon} alt="Add Flag" />
            </div>
            Add Flag
          </h3>
          <p className="drawer-subtitle">Add description to the flagged scope</p>
        </div>
      }
      footer={
        <div className="drawer-footer">
          <Button className="secondary-btn" size="large" shape="round" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="primary-btn"
            type="primary"
            size="large"
            shape="round"
            onClick={handleAdd}>
            ADD
          </Button>
        </div>
      }>
      <Form layout="vertical" className="add-scope-form">
        <Form.Item
          name="description"
          label="Description"
          rules={[{ max: 500, message: "Description must not exceed 500 characters" }]}>
          <Input.TextArea
            className="textarea"
            rows={8}
            maxLength={500}
            placeholder="Briefly describe what this scope covers for compliance and reporting"
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default AddScopeDrawer;
