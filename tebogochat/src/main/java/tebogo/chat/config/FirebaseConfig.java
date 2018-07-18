package tebogo.chat.config;

import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import java.io.File;
import java.io.FileInputStream;


@Configuration
public class FirebaseConfig {

    @Value("${firebase.db.url}")
    private String databaseUrl;

    @Value("${firebase.config.file}")
    private String configPath;

    @Bean
    public DatabaseReference firebaseDatabse() {
        DatabaseReference firebase = FirebaseDatabase.getInstance().getReference();
        return firebase;
    }

    @PostConstruct
    public void init() throws Exception{
        ClassLoader classLoader = getClass().getClassLoader();
        File file = new File(classLoader.getResource(configPath).getFile());
        FileInputStream serviceAccount = new FileInputStream(file);

        FirebaseOptions options = new FirebaseOptions.Builder().setServiceAccount(serviceAccount)
                .setDatabaseUrl(databaseUrl).build();
        FirebaseApp.initializeApp(options);
    }
}
