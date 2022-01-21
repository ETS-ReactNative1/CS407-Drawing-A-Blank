export default function Cache(initContent = {}) {
  this.content = initContent;

  this.addElement = ({
    key,
    content,
    requestObject,
    requesterObject,
    max_age = 0, // default always get latest from backend
  }) => {
    if (!content) {
      content = requesterObject(requestObject);
    }

    expiry_date = Date.now() + max_age;

    this.content[key] = [
      content, // promise
      requestObject,
      requesterObject,
      expiry_date,
    ];
  };

  // return just the "content" field of an element
  this.getElementContent = async (key, getLatestFlag) => {
    return (await this.getElement(key, getLatestFlag))[0];
  };

  this.getElement = ({key}, getLatestFlag) => {
    [content, requestObject, requesterObject, expiry_date] = this.content[key];

    if (expiry_date >= Date.now() || getLatestFlag) {
      updatedElement = [requesterObject(requestObject), ...this.content[key]];
      this.content[key] = updatedElement;
      return updatedElement;
    } else {
      return this.content[key];
    }
  };
}
