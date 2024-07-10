/* Create the database */
DROP DATABASE IF EXISTS CBS_DB;

CREATE DATABASE IF NOT EXISTS CBS_DB;

USE CBS_DB;

CREATE TABLE
    addresses (
        addressID int AUTO_INCREMENT,
        street varchar(50) NOT NULL,
        city varchar(50) NOT NULL,
        zipcode varchar(10) NOT NULL,
        PRIMARY KEY (addressID)
    );

-- Create table users
CREATE TABLE
    users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userName VARCHAR(255) UNIQUE,
        name VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(20),
        addressID int,
        streamToken VARCHAR(255) default NULL,
        FOREIGN KEY (addressID) REFERENCES addresses (addressID)
    );

-- Create table parent_client
CREATE TABLE
    parent_client (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL
    );

-- Create table clients
CREATE TABLE
    clients (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userID INT NOT NULL,
        FOREIGN KEY (userID) REFERENCES users (id)
    );

-- Create table employees
CREATE TABLE
    employees (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userID INT NOT NULL,
        role VARCHAR(255) NOT NULL,
        FOREIGN KEY (userID) REFERENCES users (id)
    );

-- Create table passwords
CREATE TABLE
    passwords (
        id INT PRIMARY KEY,
        password VARCHAR(255) NOT NULL,
        FOREIGN KEY (id) REFERENCES users (id)
    );

-- Create table employee_client
CREATE TABLE
    employee_client (
        clientID INT NOT NULL,
        employeeID INT NOT NULL,
        FOREIGN KEY (clientID) REFERENCES clients (id),
        FOREIGN KEY (employeeID) REFERENCES employees (id),
        PRIMARY KEY (clientID, employeeID)
    );

-- Create table files
CREATE TABLE
    files (
        id INT AUTO_INCREMENT PRIMARY KEY,
        driveFileId VARCHAR(255) NOT NULL,
        uploaderID INT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(255),
        status VARCHAR(255),
        remark VARCHAR(255),
        clientID INT NOT NULL,
        FOREIGN KEY (uploaderID) REFERENCES users (id),
        FOREIGN KEY (clientID) REFERENCES users (id)
    );

CREATE TABLE
    chats (
        id INT AUTO_INCREMENT PRIMARY KEY,
        fileID INT,
        userID INT,
        FOREIGN KEY (fileID) REFERENCES files (id),
        FOREIGN KEY (userID) REFERENCES users (id)
    );

-- Insert data into addresses
INSERT INTO
    addresses (street, city, zipcode)
VALUES
    ('שדרות רוטשילד 1', 'תל אביב', '6688101'),
    ('דרך בגין 132', 'תל אביב', '6701101'),
    ('רחוב הרצל 16', 'חיפה', '3303130'),
    ('שדרות בן גוריון 1', 'באר שבע', '8489101'),
    ('רחוב יפו 97', 'ירושלים', '9462097'),
    ('שדרות ממילא 10', 'ירושלים', '9414116'),
    ('רחוב אחד העם 13', 'תל אביב', '6515601'),
    ('שדרות הנשיא 123', 'חיפה', '3498123'),
    ('רחוב ויצמן 6', 'נתניה', '4240007'),
    ('רחוב הרצל 91', 'ראשון לציון', '7528901'),
    ('שדרות ירושלים 2', 'אשדוד', '7752502'),
    ('רחוב סוקולוב 48', 'הרצליה', '4644048'),
    ('רחוב ביאליק 22', 'רמת גן', '5246022'),
    ('שדרות מוריה 132', 'חיפה', '3457132'),
    ('רחוב אלנבי 99', 'תל אביב', '6579909'),
    ('דרך יצחק רבין 2', 'גבעתיים', '5348302');

INSERT INTO
    users (
        userName,
        name,
        email,
        phone,
        addressID,
        streamToken
    )
VALUES
    (
        'YossiCohen',
        'יוסי כהן',
        'yossi.cohen@gmail.com',
        '052-1234567',
        1,
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXNlci00In0.fEKU1XglcDcdXHKf6OL-'
    ),
    (
        'RachelLevi',
        'רחל לוי',
        'rachel.levi@walla.co.il',
        '054-2345678',
        2,
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXNlci0yIn0.81erpPi88IvI_mJdv8TGrDaduKD2A9pXpV17QleJ9QQ'
    ),
    (
        'MoshePeretz',
        'משה פרץ',
        'moshe.peretz@hotmail.com',
        '050-3456789',
        3,
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXNlci0zIn0.FGNo3Zbvocxw7fRp0yTJ7hstLSnrl4DTXn-_dKksqFo'
    ),
    (
        'DanaGoldstein',
        'דנה גולדשטיין',
        'dana.goldstein@gmail.com',
        '053-4567890',
        4,
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXNlci00In0.fEKU1XglcDcdXHKf6OL-3LkNwK9CUjioTuej84639GE'
    ),
    (
        'EladSharon',
        'אלעד שרון',
        'elad.sharon@yahoo.com',
        '058-5678901',
        5,
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXNlci01In0.lddw7yhTkwnylUnk82zjx43M20pSuoHKSIpEIqFFxDI'
    ),
    (
        'MichalAvraham',
        'מיכל אברהם',
        'michal.avraham@gmail.com',
        '052-6789012',
        1,
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXNlci02In0.hB2mW7_OficCI2JaDlxB_iBQ3MoGt6RuHiQa0kmwOwI'
    ),
    (
        'AviFriedman',
        'אבי פרידמן',
        'avi.friedman@walla.co.il',
        '054-7890123',
        2,
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXNlci03In0._yCPiL-q3nvMRzPg1ttYYShjDSHmDMamPYs5TlFjXbE'
    ),
    (
        'TamarKatz',
        'תמר כץ',
        'tamar.katz@hotmail.com',
        '050-8901234',
        3,
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXNlci04In0.MFmpXLPbJ_NdGVU9HNIeOTFpCpVgQiPfptS6FSlWPe4'
    ),
    (
        'GilRosen',
        'גיל רוזן',
        'gil.rosen@gmail.com',
        '053-9012345',
        4,
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXNlci05In0.TBgCGHwJ6XjA9dRZqM3ZO1Q7LC-3y2IROtHojA47Pb0'
    ),
    (
        'LiatBen',
        'ליאת בן',
        'liat.ben@yahoo.com',
        '058-0123456',
        5,
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXNlci0xMCJ9.5hE1cob5SwcwL053UIfzDV6ukjt3C6i3dUs-lRQMIO0'
    ),
    (
        'NadavLevy',
        'נדב לוי',
        'nadav.levy@company.co.il',
        '03-6123456',
        6,
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXNlci0xMSJ9.DyIfGWKeoHdz7sC4Oh0yya_N5-YRgkrGVILAgxl_164'
    ),
    (
        'ShiraMizrachi',
        'שירה מזרחי',
        'shira.mizrachi@company.co.il',
        '03-6234567',
        7,
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXNlci0xMiJ9.Whw6y_ujCmrhrkCpm1xGFcNajgzGNFOvrFJ18td7stM'
    ),
    (
        'OmerDagan',
        'עומר דגן',
        'omer.dagan@company.co.il',
        '03-6345678',
        8,
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXNlci0xMyJ9.Beg4rR2pldDP_lldZIdhw0_gI8Uo8RSo4vIKQHotCW4'
    ),
    (
        'HadasCohen',
        'הדס כהן',
        'hadas.cohen@company.co.il',
        '03-6456789',
        9,
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXNlci0xNCJ9.34Fflof0MnBiDe7qWuhPN5f2BKDJz0Oi0RnCeERvMmM'
    ),
    (
        'YairGolan',
        'יאיר גולן',
        'yair.golan@company.co.il',
        '03-6567890',
        10,
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXNlci0xNSJ9.d4n1W5AfW3ECKPvmU5ut4ZGW3mZf-lgoij92cDxizOY'
    ),
    (
        'LiorAvidan',
        'ליאור אבידן',
        'lior.avidan@company.co.il',
        '03-6678901',
        11,
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXNlci0xNiJ9.aj4Q03s9EtbP6OB3astXAHrZdKpQnVQyc2nhVxKwo1k'
    ),
    (
        'MayaShapira',
        'מאיה שפירא',
        'maya.shapira@company.co.il',
        '03-6789012',
        12,
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXNlci0xNyJ9.nK9Y3MQSoMjPHrW9Taa29_G0uv3lxh6XHUf9kJ0Wl-Q'
    ),
    (
        'TalBarOn',
        'טל בר-און',
        'tal.baron@company.co.il',
        '03-6890123',
        13,
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXNlci0xOCJ9.MyyGBFqWBZi2c1Id70LtBHfUouhsPQbs_5gfzwW8sM4'
    ),
    (
        'RonitSegal',
        'רונית סגל',
        'ronit.segal@company.co.il',
        '03-6901234',
        14,
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXNlci0xOSJ9.7ZFDVvqivtGUgZRb7bRlU1hFrBGHhAvPoBF1QhnRhJ0'
    ),
    (
        'IdanNaim',
        'עידן נעים',
        'idan.naim@company.co.il',
        '03-7012345',
        15,
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXNlci0yMCJ9.ZPQLpRtbJp5xwgrIpQYmlUllTrUyKpdZtwXakdut9Ys'
    );

-- Insert data into clients
INSERT INTO
    clients (userID)
VALUES
    (1),
    (2),
    (3),
    (4),
    (5),
    (6),
    (7),
    (8),
    (9),
    (10);

-- Insert data into employees
INSERT INTO
    employees (userID, role)
VALUES
    (11, 'Role 1'),
    (12, 'Role 2'),
    (13, 'Role 1'),
    (14, 'Role 1'),
    (15, 'Role 1'),
    (16, 'Role 2'),
    (17, 'Role 2'),
    (18, 'Admin'),
    (19, 'Admin'),
    (20, 'Admin');

-- Insert 20 rows into passwords
INSERT INTO
    passwords (id, password)
VALUES
    (
        1,
        '$2a$10$i/cwt/hlYfjw0tXchnmwPe9k56rtGu.B2LhPaiF6m4c22wnQtr.qK'
    ),
    (
        2,
        '$2a$10$h5C7DJoMV7Xuoa7MAuCva.H/mDz5aNo4EKUSI.kKpuzd0A60mULGS'
    ),
    (
        3,
        '$2a$10$GiQHNorjX6nnX5Kdwvbt3.Z5SEQI7oYeYwVBn6awKtWmDab3thvZS'
    ),
    (
        4,
        '$2a$10$KwM4OcRYS//wQVToN8ug8OWGirnbEsUYj/.ZcofcVr.PXdahVvOeS'
    ),
    (
        5,
        '$2a$10$uMpI0w0BE1e0hi9CrPc/nO2U2a9RDMxv4zVZducCGZb/WGUBMg9bu'
    ),
    (
        6,
        '$2a$10$rtVqChLqWZrGWMfNULS6/.s2wroiTKnT2PrJP2jHBlO031uyDcEoS'
    ),
    (
        7,
        '$2a$10$jSQvILuLIMaiNM75QlPthuKL9bU0ENVoKCpyRKcVJwbV5TvP2FVmK'
    ),
    (
        8,
        '$2a$10$zk/L/M2umtVziwkfKVO/aO.UTb1xIkbzL/EUpi9NH3YU38NQp22jO'
    ),
    (
        9,
        '$2a$10$i7WKk5ivAlMbVwj94WD4KOAgnqmpxyAgOkQ7oGK50nwlCQ74CSe2K'
    ),
    (
        10,
        '$2a$10$63RVEqjaXMINtC3jRwcafutjVwXY2KAl6EjjcFr3hLJzSxpZvIJee'
    ),
    (
        11,
        '$2a$10$fvhPkzi5enbsQPmsraHQQ.XWcc/fqu1AWh1uM4.vKFVLo8kFhM.0y'
    ),
    (
        12,
        '$2a$10$5f3QgTR53507Iknbok986eImEOhT2VFZKHGXarQyu5xYxGpyWmuSq'
    ),
    (
        13,
        '$2a$10$o68tTc5IYNRrDRgWscP7AetxlggLfOEhtwRSlB26OMhhfjBl1/I4C'
    ),
    (
        14,
        '$2a$10$xtvg9TKCk54dCStEYt9JVeYGlQYdah6/tq4mAXg1HVA34RPXW20ju'
    ),
    (
        15,
        '$2a$10$Q07zjsP24IGM/r5ba1GayumG7FEoHxzONCnEgPEtOIMSHTRw15HuC'
    ),
    (
        16,
        '$2a$10$.LuqRmG/ymYg4gdhugqLFu36zbTKvtuN32C6HNuYDm/6ZFRVPNtkW'
    ),
    (
        17,
        '$2a$10$xE97mGwmQ336IPCI73Po5elFjq4Ks0whkNKvu.agMubNyzMqvscui'
    ),
    (
        18,
        '$2a$10$omEaTPICnQHxsmSlvif7I.9/CaDU1Z2pAMN1obh.ayoVVKi0Z9zXW'
    ),
    (
        19,
        '$2a$10$Xd.9S5o.8tJXDNr5v/KaH.krc2WilPib3UrkiACKJqFgbFFM93omq'
    ),
    (
        20,
        '$2a$10$nU846P0.Gm37vI6BjlFqfe1cICXWgW6dTco0F5q5nqol/0Mx0TV1e'
    );

-- Insert 10 rows into employee_client
INSERT INTO
    employee_client (clientID, employeeID)
VALUES
    (1, 1),
    (2, 2),
    (3, 3),
    (4, 4),
    (5, 5),
    (6, 6),
    (6, 4),
    (2, 7),
    (3, 4),
    (4, 1),
    (5, 2),
    (6, 3),
    (7, 1),
    (8, 1),
    (9, 1),
    (10, 6);

INSERT INTO
    files (
        driveFileId,
        name,
        type,
        uploaderID,
        clientID,
        status
    )
VALUES
    (
        '1qSWXVUOZqwDaTsb5zrH2vfE861IA7NqL',
        'אלגוריתמים 1.pdf',
        'Current material for accounting',
        '6',
        '6',
        'Deleted'
    ),
    (
        '1Z5F516tig6otzDXaghQ3VkeCH-NyvXdI',
        'אלגוריתמים 2.pdf',
        'Current material for accounting',
        '6',
        '6',
        'Approved'
    ),
    (
        '19hrI6kwjhYkxdOJDY5jhcGZOl7bktTnQ',
        'אלגוריתמים 3.pdf',
        'Current material for accounting',
        '6',
        '6',
        'Rejected'
    ),
    (
        '1lRgQtDPuxygWXiVacrvDflO4dnve0PXi',
        'אלגוריתמים 4.pdf',
        'Current material for accounting',
        '6',
        '6',
        'Deleted'
    ),
    (
        '1OF7_AErO7LiRlfI_97gSNjDEj5bzfNPv',
        'אלגוריתמים 6.pdf',
        'Current material for accounting',
        '6',
        '6',
        'Approved'
    ),
    (
        '1uLydItu_0x1Ln3MXFFfUn90v7X1Dyn9q',
        'אלגוריתמים 8.pdf',
        'Current material for accounting',
        '6',
        '6',
        'Approved'
    ),
    (
        '1rFY-T8tXu5yggkCBMa-FVqgO-PkWxEhd',
        'אלגוריתמים 9.pdf',
        'Current material for accounting',
        '6',
        '6',
        'Approved'
    ),
    (
        '1eFzlcTSfMH16aD-5OdsvXZIKipsqF8NJ',
        'אלגורתימים 7.pdf',
        'Current material for accounting',
        '6',
        '6',
        'Approved'
    ),
    (
        '1WeET8hrYGYgn5Tmlae3GTEsK_gIlGbYL',
        'חומרה 1.pdf',
        'Material for an annual report',
        '6',
        '6',
        'Approved'
    ),
    (
        '1GppicuLujtRvLCrziw8MenLVGjY6XOUW',
        'חומרה 2.pdf',
        'Material for an annual report',
        '6',
        '6',
        'Approved'
    ),
    (
        '14Fel6Gx5pgt6TGgXSTWWMtOiXY8o79-5',
        'חומרה 3.pdf',
        'Material for an annual report',
        '6',
        '6',
        'Deleted'
    ),
    (
        '1Oa3xHiAVY3A9FLFqcrrzvxCwpDlW0JbJ',
        'חומרה 4.pdf',
        'Material for an annual report',
        '6',
        '6',
        'Approved'
    ),
    (
        '1T9FiVu_uAHuIZxm7mPeQth2aoDMKSCUT',
        'חומרה 5.pdf',
        'Material for an annual report',
        '6',
        '6',
        'Rejected'
    ),
    (
        '1Je5dF1T5chbeb8_ZC5H8i6NUr8-xCncX',
        'חומרה 6.pdf',
        'Material for an annual report',
        '6',
        '6',
        'Approved'
    ),
    (
        '18j8bDUJyCpbPoEc2-QtD0B2tNUbWPs7-',
        'חומרה 7.pdf',
        'Material for an annual report',
        '6',
        '6',
        'Pending'
    ),
    (
        '17ZoRj7yd5j4qCGVWXO1h4514Z_g0_c5j',
        'לוגיקה 2.pdf',
        'Approvals, tax coordination and miscellaneous',
        '1',
        '1',
        'Approved'
    ),
    (
        '1mTmQ0FhBjb1bXc909FbDzToyr5V7GBDv',
        'לוגיקה 3.pdf',
        'Approvals, tax coordination and miscellaneous',
        '6',
        '6',
        'Pending'
    ),
    (
        '1hR0EryUw1qHW4rpBbjK6lbkr5X2yiLWR',
        'לוגיקה 4.pdf',
        'Approvals, tax coordination and miscellaneous',
        '6',
        '6',
        'Deleted'
    ),
    (
        '14GiXT11YXpKEzAuJfzl3PKkIn3_dyOM4',
        'לוגיקה 5.pdf',
        'Approvals, tax coordination and miscellaneous',
        '6',
        '6',
        'Rejected'
    ),
    (
        '10JRoYSVLPkaivL3dpqC4i_8U9vFVQWn8',
        'לוגיקה 6.pdf',
        'Approvals, tax coordination and miscellaneous',
        '6',
        '6',
        'Pending'
    ),
    (
        '114SZtM_MHMkxjuqGdZjhWqR7mb2uFks9',
        'לוגיקה 7.pdf',
        'Approvals, tax coordination and miscellaneous',
        '6',
        '6',
        'Approved'
    ),
    (
        '1eR6vCURW76GCuBIWKItmclfQkVudI8dv',
        'לוגיקה 8.pdf',
        'Approvals, tax coordination and miscellaneous',
        '6',
        '6',
        'Deleted'
    ),
    (
        '1gM3aBjnRnj5wIbtIfdoKCFemYG-R_Z9l',
        'לוגיקה 9.pdf',
        'Approvals, tax coordination and miscellaneous',
        '6',
        '6',
        'Approved'
    ),
    (
        '1g20kcLFYyjQkLJ_khBrkZZKXj-k6bWH3',
        'לוגיקה 10.pdf',
        'Approvals, tax coordination and miscellaneous',
        '6',
        '6',
        'Approved'
    ),
    (
        '12xNwQ6YAbcGIXWMEvSFxJQ38i10VxsY4',
        'לוגיקה 11.pdf',
        'Approvals, tax coordination and miscellaneous',
        '6',
        '6',
        'Approved'
    ),
    (
        '1yrUDNDWCo_2HXCvu2DGf7LA7EteXeWPI',
        'מבנת 2.pdf',
        'Reports and information to download',
        '2',
        '2',
        'Rejected'
    ),
    (
        '1pyQ4vUHtjDa-7A80cvj5ox5e0ew_5O0K',
        'מבנת 3.pdf',
        'Reports and information to download',
        '2',
        '2',
        'Deleted'
    ),
    (
        '1EwE0pTcoShu-guTTpEvY_qNHm4zBKiZS',
        'מבנת 5.pdf',
        'Reports and information to download',
        '2',
        '2',
        'Pending'
    ),
    (
        '1acx03Qi-CD4YqqArAqGLjl__TcXxzlQj',
        'שירה לוגיקה 1.pdf',
        'Approvals, tax coordination and miscellaneous',
        '2',
        '2',
        'Pending'
    ),
    (
        '1e8SQw3B093KNU_D5SN0MgNBnKXIDtQYD',
        'אלגוריתמים - השיטה הדינאמית.pdf',
        'Material for an annual report',
        '2',
        '2',
        'Approved'
    ),
    (
        '1uAnWTnLNkqjzo-vPtokiKV6Ia4M3Nf2z',
        'חומרה 8 שירה ברוורמן.pdf',
        'Material for an annual report',
        '2',
        '2',
        'Rejected'
    ),
    (
        '10LFUdcYqe_H1mWIc1g6gFyo9Es-SeLj_',
        'לוגיקה 3.pdf',
        'Material for an annual report',
        '2',
        '2',
        'Approved'
    ),
    (
        '1XeDT1l30edaYtuWZirQtVC12qsTB3lOV',
        'אלגוריתמים 4.pdf',
        'Material for an annual report',
        '3',
        '3',
        'Pending'
    ),
    (
        '1R8TiNqfIV-zJO1WEvMdbJGKJQwArV-nL',
        'אלגוריתמים 6.pdf',
        'Material for an annual report',
        '3',
        '3',
        'Deleted'
    ),
    (
        '16u0QxOdV0TUKUrtEOVfR80GxfokYQAqc',
        'אלגוריתמים 6.pdf',
        'Approvals, tax coordination and miscellaneous',
        '3',
        '3',
        'Rejected'
    ),
    (
        '1LzyDRPoa7XabLsbiypWfWMX1tIJ36FJW',
        'אלגורתימים 7.pdf',
        'Approvals, tax coordination and miscellaneous',
        '3',
        '3',
        'Approved'
    ),
    (
        '1NYZzu_Z2rhBYfwaE10MqsWU4G4MD8z42',
        'חומרה 1.pdf',
        'Approvals, tax coordination and miscellaneous',
        '3',
        '3',
        'Approved'
    ),
    (
        '1wneJnp5xv4adXyx9XI1CtXRPKMUsn7KH',
        'אלגוריתמים 6.pdf',
        'Current material for accounting',
        '3',
        '3',
        'Pending'
    ),
    (
        '1QycKqeUIzQW7i1TKAiogLt-m5FjyyHeu',
        'חומרה 4.pdf',
        'Current material for accounting',
        '3',
        '3',
        'Pending'
    ),
    (
        '18UyiB_XlSGU99jgSqQ8I0whRqnvtV5WB',
        'אלגוריתמים 8.pdf',
        'Reports and information to download',
        '3',
        '3',
        'Deleted'
    ),
    (
        '1A7weiaicSAdeVQOJ5R_P8jJ5eh7O6-XH',
        'חומרה 3.pdf',
        'Reports and information to download',
        '3',
        '3',
        'Rejected'
    ),
    (
        '1a0Z7hZ1DYEIy-2egGLiW-9PnGePXChA7',
        'אלגוריתמים 1.pdf',
        'Material for an annual report',
        '4',
        '4',
        'Pending'
    ),
    (
        '1e5LS4R5unB1NZ3CnAqwwkUPjpYPVCpm0',
        'אלגוריתמים 2.pdf',
        'Material for an annual report',
        '4',
        '4',
        'Approved'
    ),
    (
        '1dWX-S3WkR5Z8MXDxYofdTH7OXaE5OHAq',
        'אלגוריתמים 3.pdf',
        'Material for an annual report',
        '4',
        '4',
        'Approved'
    ),
    (
        '1w0TDQUWuYWSFcORLVjw2HT1DoAyn7lrz',
        'אלגוריתמים 4.pdf',
        'Material for an annual report',
        '4',
        '4',
        'Deleted'
    ),
    (
        '1zpCTLltsoiCCap4DUZ1SW5aSeQz8PTmQ',
        'אלגוריתמים 6.pdf',
        'Material for an annual report',
        '4',
        '4',
        'Approved'
    ),
    (
        '1WWZBa-RrK4C4gn-XK6pJtoFiBWP8XRZV',
        'אלגוריתמים 8.pdf',
        'Material for an annual report',
        '4',
        '4',
        'Approved'
    ),
    (
        '11VpC4tFAmc5WmS2qNS4cT-VIokq65zLK',
        'אלגוריתמים 9.pdf',
        'Material for an annual report',
        '4',
        '4',
        'Rejected'
    ),
    (
        '1Rzp9cuViaimhQWN8A22p4KzEXQjCH70d',
        'אלגורתימים 7.pdf',
        'Material for an annual report',
        '4',
        '4',
        'Approved'
    ),
    (
        '1ukAhvDY7nAgcI-bh-ztm9zvdLTwBFG-B',
        'חומרה 1.pdf',
        'Current material for accounting',
        '4',
        '4',
        'Deleted'
    ),
    (
        '1tvq5TZXTgCo_cwRGuY9rqWtPHWMh1Lzt',
        'חומרה 2.pdf',
        'Current material for accounting',
        '4',
        '4',
        'Approved'
    ),
    (
        '1P9Kjv5IxJbIlG5m0Eclgj4Fyv-j4G9ea',
        'חומרה 3.pdf',
        'Current material for accounting',
        '4',
        '4',
        'Deleted'
    ),
    (
        '1srUC_6nlGC-oc4p3xLw5OxeCOaKjGPGh',
        'חומרה 4.pdf',
        'Current material for accounting',
        '4',
        '4',
        'Approved'
    ),
    (
        '1_54GFAWLTNTqYifjIeNB96zKjxHIOUk9',
        'חומרה 5.pdf',
        'Current material for accounting',
        '4',
        '4',
        'Deleted'
    ),
    (
        '1aXXzSzBWD3wpwBq1eN2U7DKzcmtnh61_',
        'חומרה 6.pdf',
        'Current material for accounting',
        '4',
        '4',
        'Rejected'
    ),
    (
        '17GShLRXfyoSMvoKSwXX_yAA2tIZXMcs_',
        'חומרה 7.pdf',
        'Current material for accounting',
        '4',
        '4',
        'Deleted'
    ),
    (
        '1OFSyyJXJrOLlFTBTotxsiV62GJU70kL_',
        'חומרה 8 שירה ברוורמן.pdf',
        'Current material for accounting',
        '4',
        '4',
        'Approved'
    ),
    (
        '13K6qP5GqZAAfL35xebLyPmD7cfbEQXMw',
        'לוגיקה 2.pdf',
        'Approvals, tax coordination and miscellaneous',
        '4',
        '4',
        'Approved'
    ),
    (
        '1IgHPushueTg4vCoYrsNACrK6oOjeDuIZ',
        'לוגיקה 3.pdf',
        'Approvals, tax coordination and miscellaneous',
        '4',
        '4',
        'Deleted'
    ),
    (
        '1FBEWGHv844Mv1Sz2TEXvtyaLPJXjgn2y',
        'לוגיקה 4.pdf',
        'Approvals, tax coordination and miscellaneous',
        '4',
        '4',
        'Rejected'
    ),
    (
        '12hxtA3qJB89ndUUDEQaQJe26r_kGz362',
        'לוגיקה 5.pdf',
        'Approvals, tax coordination and miscellaneous',
        '4',
        '4',
        'Pending'
    ),
    (
        '14B5oGFVzGAaX3K00lw0L23pQFNc-L7Ax',
        'לוגיקה 6.pdf',
        'Approvals, tax coordination and miscellaneous',
        '4',
        '4',
        'Approved'
    ),
    (
        '1lm9wlAso4TLYvFKFh_WevbnISntpuM5A',
        'לוגיקה 7.pdf',
        'Approvals, tax coordination and miscellaneous',
        '4',
        '4',
        'Approved'
    ),
    (
        '1VFGsj8rYPeSQ2smayNdw1uSOZvNWBUJ9',
        'לוגיקה 8.pdf',
        'Approvals, tax coordination and miscellaneous',
        '4',
        '4',
        'Deleted'
    ),
    (
        '1Hea2MKWofGniOTx4JLUj3jxe2xxXbXrd',
        'לוגיקה 9.pdf',
        'Approvals, tax coordination and miscellaneous',
        '4',
        '4',
        'Approved'
    ),
    (
        '17ioA5yRHAA5Mg0nCXEXgTSZaS1s3-fuH',
        'מבנת 2.pdf',
        'Reports and information to download',
        '4',
        '4',
        'Rejected'
    ),
    (
        '1SfTRLqH9LkWldHhxclpR9Gxb_7XIrFAp',
        'מבנת 3.pdf',
        'Reports and information to download',
        '4',
        '4',
        'Approved'
    ),
    (
        '1dggfKsxIsq_nrWMJQnWvsfg2eH1CJG65',
        'מבנת 5.pdf',
        'Reports and information to download',
        '4',
        '4',
        'Deleted'
    ),
    (
        '11a3UJVI4MjtuPSVz_xzldeivvpEezcCF',
        'אלגוריתמים 4.pdf',
        'Material for an annual report',
        '14',
        '3',
        'Approved'
    ),
    (
        '14AB97tzzHXqMLv0ryCfvTES0DuENfFHR',
        'אלגוריתמים 6.pdf',
        'Material for an annual report',
        '14',
        '3',
        'Rejected'
    ),
    (
        '1bJOC4t-qc7d92SGgS-ENZqmmx99h1MDO',
        'אלגוריתמים 8.pdf',
        'Material for an annual report',
        '14',
        '3',
        'Approved'
    ),
    (
        '1SFMxDhy-qCEx9SU828qw-47IBOVTx_XU',
        'מבנת 2.pdf',
        'Approvals, tax coordination and miscellaneous',
        '14',
        '3',
        'Approved'
    ),
    (
        '1-2_ahIhFyfSC4Ay17GvjYHDOpURJOHKw',
        'מבנת 3.pdf',
        'Approvals, tax coordination and miscellaneous',
        '14',
        '3',
        'Deleted'
    ),
    (
        '1ooL3oRPbNGnaaLL18cz9qEqcaZwgfg25',
        'מבנת 5.pdf',
        'Approvals, tax coordination and miscellaneous',
        '14',
        '3',
        'Approved'
    ),
    (
        '1wAKwEpbkElgckBSEQgq24oB4xco2lh2J',
        'חומרה 1.pdf',
        'Current material for accounting',
        '14',
        '4',
        'Approved'
    ),
    (
        '185RmCGSr_q4pQDxfSdQytzjyJifQd0fP',
        'חומרה 2.pdf',
        'Current material for accounting',
        '14',
        '4',
        'Rejected'
    ),
    (
        '1ONPVNJe5W5Wd_UQzgkPvhWL53YyeXpYf',
        'חומרה 3.pdf',
        'Current material for accounting',
        '14',
        '4',
        'Approved'
    ),
    (
        '1LGuAAPU_Xm2M-gjGBYh40uApJNawqdhy',
        'חומרה 4.pdf',
        'Current material for accounting',
        '14',
        '4',
        'Deleted'
    ),
    (
        '1v1h95LjOBouynsmNxG3-9TdICuGdTAuj',
        'חומרה 5.pdf',
        'Current material for accounting',
        '14',
        '4',
        'Approved'
    ),
    (
        '1hfbxWPAG9r5x63ceNDYrOc6ivbGl3Nl_',
        'אלגוריתמים 3.pdf',
        'Reports and information to download',
        '14',
        '4',
        'Approved'
    ),
    (
        '145v1rCMwHfZGDdGtTxzxj2Cv6GQ5DX4F',
        'אלגוריתמים 4.pdf',
        'Reports and information to download',
        '14',
        '4',
        'Rejected'
    ),
    (
        '1jPXqYxB31LLti2hlMWorHnbqkTKcW2c4',
        'אלגוריתמים 6.pdf',
        'Reports and information to download',
        '14',
        '4',
        'Pending'
    ),
    (
        '1En3U_OcuWgqt3P061zYKGMEiOVNXDiHQ',
        'אלגוריתמים 8.pdf',
        'Reports and information to download',
        '14',
        '4',
        'Approved'
    ),
    (
        '13TZ1q8WSdmDk4b4tXjEt84YKSCBLC8pM',
        'אלגוריתמים 2.pdf',
        'Reports and information to download',
        '20',
        '6',
        'Deleted'
    ),
    (
        '1gfHSiiHlciZOSTT_WngiUB9wRyfvF0zE',
        'אלגוריתמים 3.pdf',
        'Reports and information to download',
        '20',
        '6',
        'Rejected'
    ),
    (
        '1BVduBRnTVVuxfC57arGER1fglMloj8Bz',
        'אלגוריתמים 4.pdf',
        'Reports and information to download',
        '20',
        '6',
        'Pending'
    ),
    (
        '1yE7SIg3s6DvfuLkoVy9CpuSPCrV95u4N',
        'אלגוריתמים 6.pdf',
        'Reports and information to download',
        '20',
        '6',
        'Pending'
    ),
    (
        '1BG1gzdTDhiRDPD6rN8dGdchoVW3fmnt7',
        'אלגוריתמים - השיטה הדינאמית.pdf',
        'Material for an annual report',
        '20',
        '6',
        'Deleted'
    ),
    (
        '1emVeV64UGaACghmC83m9ilP2NAHDNh5b',
        'אלגוריתמים 1.pdf',
        'Material for an annual report',
        '20',
        '6',
        'Approved'
    ),
    (
        '1a54f-dDjRhTuGDbNUeFv0VLrQ1GvVT2M',
        'אלגוריתמים 2.pdf',
        'Material for an annual report',
        '20',
        '6',
        'Rejected'
    ),
    (
        '1U_C4xgmh6OKutpX5irLExJz-y0aRl8T6',
        'אלגוריתמים 3.pdf',
        'Material for an annual report',
        '20',
        '6',
        'Pending'
    ),
    (
        '1LDhkdK0smsWmG0wGWd4h5pulNIf4d_rO',
        'אלגוריתמים 4.pdf',
        'Material for an annual report',
        '20',
        '6',
        'Deleted'
    ),
    (
        '1AA4ndTxQ-XwsxmXGug07LLDmunNTxEar',
        'לוגיקה 6.pdf',
        'Current material for accounting',
        '4',
        '4',
        'Pending'
    ),
    (
        '1s9I-WzFGkSzw6rYZBDx9rCarK1cG9KIv',
        'אלגורתימים 7.pdf',
        'Current material for accounting',
        '4',
        '4',
        'Pending'
    ),
    (
        '1eu3sO9quV-BkL6GQxM-Tl61UNgvoRDv3',
        'AWS Course for DevOps Juniors.pdf',
        'Current material for accounting',
        '20',
        '3',
        'Pending'
    );

INSERT INTO
    chats (userID)
VALUES
    (3);

INSERT INTO
    chats (userID)
VALUES
    (4);

INSERT INTO
    chats (userID)
VALUES
    (6);

INSERT INTO
    chats (fileID)
VALUES
    (2);

INSERT INTO
    chats (fileID)
VALUES
    (19);

INSERT INTO
    chats (fileID)
VALUES
    (17);

INSERT INTO
    chats (userID)
VALUES
    (1);

INSERT INTO
    chats (userID)
VALUES
    (9);