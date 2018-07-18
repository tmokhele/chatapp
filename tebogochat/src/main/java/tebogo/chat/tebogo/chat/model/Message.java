package tebogo.chat.tebogo.chat.model;

public class Message {
    private String uid;
    private int id;
    private String username;
    private String avatar;
    private String usermessage;

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getUsermessage() {
        return usermessage;
    }

    public void setUsermessage(String usermessage) {
        this.usermessage = usermessage;
    }
}
