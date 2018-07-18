package tebogo.chat.controller;

import com.google.firebase.database.*;
import com.google.gson.Gson;
import org.json.JSONObject;
import org.springframework.web.bind.annotation.*;
import tebogo.chat.tebogo.chat.model.Chat;
import tebogo.chat.tebogo.chat.model.Message;
import tebogo.chat.tebogo.chat.model.User;

import java.util.*;

@RestController
@RequestMapping("chat/")
public class ChatApplicationController {

    List<Chat> chats;
    @GetMapping("/all")
    public @ResponseBody List<Chat> retrieveChats()
    {
         chats = new ArrayList<>();
        DatabaseReference ref = FirebaseDatabase.getInstance()
                .getReference("chats");
        ref.addListenerForSingleValueEvent(new ValueEventListener() {

            public void onDataChange(DataSnapshot dataSnapshot) {
                Map<String, Object>  document = (Map<String, Object>) dataSnapshot.getValue();
                document.entrySet().forEach(entry ->
                        {
                            mapChats(JSONObject.valueToString(entry.getValue()));

                        }
                );
            }

            public void onCancelled(DatabaseError error) {
                throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
            }
        });
        return chats;
    }

    private void mapChats(String entry) {
        Gson g = new Gson();
        Message value = g.fromJson(entry, Message.class);
        Chat c = new Chat();
        User u = new User();
        u.setAvatar(value.getAvatar());
        u.setId(value.getId());
        u.setName(value.getUsername());
        c.setContent(value.getUsermessage());
        c.setFrom(u);
        chats.add(c);
    }

    @PostMapping
    public @ResponseBody Chat saveChat(@RequestBody Chat chat)
    {
        Message message = new Message();
        UUID idOne = UUID.randomUUID();
        message.setAvatar(chat.getFrom()!=null?chat.getFrom().getAvatar():"");
        message.setId(chat.getFrom()!=null?chat.getFrom().getId():0);
        message.setUsername(chat.getFrom()!=null?chat.getFrom().getName():"Unknown");
        message.setUsermessage(chat.getContent());
        message.setUid(String.valueOf(idOne));
        DatabaseReference ref = FirebaseDatabase.getInstance()
                .getReference("chats");
        DatabaseReference childRef = ref.child(String.valueOf(idOne));
        childRef.setValue(message);
        childRef.push();
        return chat;
    }
}
