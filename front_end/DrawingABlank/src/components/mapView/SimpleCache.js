export default function Cache(initContent = {}) {
  this.content = initContent;

  this.addEntry = ({
    key,
    content,
    refreshContent,
    //requestObject,
    //requesterObject,
    max_age = 0, // default always get latest from backend
  }) => {
    if (!content) {
      content = refreshContent();
    }

    expiry_date = Date.now() + max_age;

    this.content[key] = [
      content, // promise
      refreshContent,
      expiry_date,
    ];
  };

  // return just the "content" field of an element
  this.getEntryContent = async (key, getLatestFlag) => {
    return (await this.getEntry(key, getLatestFlag))[0];
  };

  this.getEntry = ({key}, getLatestFlag) => {
    [content, refreshContent, expiry_date] = this.content[key];

    if (expiry_date >= Date.now() || getLatestFlag) {
      updatedElement = [refreshContent(), ...this.content[key]];
      this.content[key] = updatedElement;
      return updatedElement;
    } else {
      return this.content[key];
    }
  };
}
