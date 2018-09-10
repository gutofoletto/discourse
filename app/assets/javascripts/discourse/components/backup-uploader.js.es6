import { ajax } from "discourse/lib/ajax";
import computed from "ember-addons/ember-computed-decorators";
import UploadMixin from "discourse/mixins/upload";

export default Em.Component.extend(UploadMixin, {
  tagName: "span",

  @computed("uploading", "uploadProgress")
  uploadButtonText(uploading) {
    if (uploading) {
      return I18n.t("admin.backups.upload.uploading_progress", {
        progress: this.get("uploadProgress")
      });
    }

    return I18n.t("admin.backups.upload.label");
  },

  validateUploadedFilesOptions() {
    return { skipValidation: true };
  },

  uploadDone() {
    this.sendAction("done");
  },

  calculateUploadUrl() {
    return "";
  },

  uploadOptions() {
    return {
      type: "PUT",
      dataType: "xml",
      autoUpload: false
    };
  },

  _init: function() {
    const $upload = this.$();

    $upload.on("fileuploadadd", (e, data) => {
      ajax("/admin/backups/upload_url", {
        data: { filename: data.files[0].name }
      }).then(result => {
        if (!result.success) {
          bootbox.alert(result.message);
        } else {
          data.url = result.url;
          data.submit();
        }
      });
    });
  }.on("didInsertElement")
});